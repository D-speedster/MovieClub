import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import {
  settingsFromRecords,
  settingsInput,
  heroKeys,
  type SettingsDTO,
} from "@/lib/settings";
import { canonicalMediaReference, managedFilename } from "@/lib/media";
import { Content, SiteSettings } from "./models";
import { serialize } from "./catalog";
import type { ContentDTO } from "@/lib/content";
import { HttpError, jsonBody } from "./http";
import { boundedMultipart, saveManagedImage, cleanupMedia } from "./media";
export const getSettings = cache(async () => {
  await connectDB();
  const rows = await SiteSettings.find({
    key: {
      $in: [
        "site_preferences",
        "featured_content",
        ...heroKeys.map((key) => `hero_${key}`),
      ],
    },
  }).lean();
  return settingsFromRecords(
    serialize<{ key: string; value: unknown; __v?: number }[]>(rows),
  );
});
export async function featuredContent(ids: string[]) {
  await connectDB();
  const rows = serialize<ContentDTO[]>(
    await Content.find({ _id: { $in: ids } }).lean(),
  );
  const byId = new Map(rows.map((item) => [item._id, item]));
  return ids.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : []));
}
export async function saveSettings(request: Request) {
  const previous = await getSettings();
  const created: string[] = [];
  const files = new Map<string, File>();
  let raw: unknown;
  try {
    if (
      request.headers
        .get("content-type")
        ?.toLowerCase()
        .startsWith("multipart/form-data")
    ) {
      const form = await boundedMultipart(request);
      if (
        [...form.keys()].some(
          (key) =>
            key !== "data" && !heroKeys.some((hero) => `hero_${hero}` === key),
        )
      )
        throw new HttpError(400, "فیلد تنظیمات نامعتبر است");
      const values = form.getAll("data");
      if (
        values.length !== 1 ||
        typeof values[0] !== "string" ||
        Buffer.byteLength(values[0]) > 128 * 1024
      )
        throw new HttpError(400, "تنظیمات نامعتبر است");
      try {
        raw = JSON.parse(values[0]);
      } catch {
        throw new HttpError(400, "تنظیمات نامعتبر است");
      }
      for (const key of heroKeys) {
        const values = form.getAll(`hero_${key}`);
        if (
          values.length > 1 ||
          values.some((value) => !(value instanceof File))
        )
          throw new HttpError(400, "فایل بنر نامعتبر است");
        if (values[0]) files.set(key, values[0] as File);
      }
    } else raw = await jsonBody(request);
    const data = settingsInput.parse(raw);
    if (data.revision !== previous.revision)
      throw new HttpError(
        409,
        "تنظیمات تغییر کرده است؛ صفحه را دوباره بارگذاری کنید",
      );
    const owned = new Set(
      Object.values(previous.heroes).map(managedFilename).filter(Boolean),
    );
    for (const key of heroKeys) {
      const name = managedFilename(data.heroes[key]);
      if (name && !owned.has(name))
        throw new HttpError(400, "برای بنر جدید فایل را دوباره انتخاب کنید");
      data.heroes[key] = canonicalMediaReference(data.heroes[key]);
    }
    for (const key of heroKeys) {
      const file = files.get(key);
      if (file)
        data.heroes[key] = await saveManagedImage(file, "gallery", created);
    }
    const session = await SiteSettings.startSession();
    try {
      await session.withTransaction(async () => {
        const current = await SiteSettings.findOne({
          key: "site_preferences",
        }).session(session);
        if ((current?.__v || 0) !== data.revision)
          throw new HttpError(
            409,
            "تنظیمات تغییر کرده است؛ صفحه را دوباره بارگذاری کنید",
          );
        const count = await Content.countDocuments({
          _id: { $in: data.featuredIds },
        }).session(session);
        if (count !== data.featuredIds.length)
          throw new HttpError(400, "یکی از محتواهای انتخاب‌شده وجود ندارد");
        const { heroes, featuredIds, revision, ...preferences } = data;
        await SiteSettings.updateOne(
          { key: "site_preferences" },
          { $set: { value: preferences, __v: revision + 1 } },
          { upsert: true, session },
        );
        for (const key of heroKeys)
          await SiteSettings.updateOne(
            { key: `hero_${key}` },
            { $set: { value: heroes[key] } },
            { upsert: true, session },
          );
        await SiteSettings.updateOne(
          { key: "featured_content" },
          { $set: { value: featuredIds } },
          { upsert: true, session },
        );
      });
    } finally {
      await session.endSession();
    }
    await cleanupMedia(Object.values(previous.heroes));
    return { ...data, revision: data.revision + 1 } satisfies SettingsDTO;
  } catch (error) {
    await cleanupMedia(created.map((name) => `/media/${name}`));
    throw error;
  }
}
