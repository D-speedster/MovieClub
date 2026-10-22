import "server-only";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import {
  mkdir,
  writeFile,
  unlink,
  readdir,
  stat,
  readFile,
} from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { Content, Trailer, SiteSettings } from "./models";
import { contentInput, escapeRegex } from "@/lib/content";
import {
  MAX_IMAGE_BYTES,
  MAX_UPLOAD_BYTES,
  MAX_GALLERY_IMAGES,
  MAX_IMAGE_PIXELS,
  IMAGE_MIME_TYPES,
  managedFilename,
  managedFilenamePattern,
  canonicalMediaReference,
} from "@/lib/media";
import { HttpError, jsonBody } from "./http";
export const mediaDirectory = () =>
  path.resolve(
    /* turbopackIgnore: true */ process.env.UPLOAD_DIR || "./.data/uploads",
  );
export type MediaContent = {
  poster?: string;
  gallery?: string[];
  __v?: number;
};
export const contentMediaReferences = (content: MediaContent) =>
  [content.poster, ...(content.gallery || [])].filter(
    (ref): ref is string => typeof ref === "string",
  );
async function boundedMultipart(request: Request) {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_UPLOAD_BYTES)
    throw new HttpError(413, "حجم کل آپلود نباید بیشتر از ۲۶ مگابایت باشد");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "فرم خالی است");
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_UPLOAD_BYTES) {
      await reader.cancel();
      throw new HttpError(413, "حجم کل آپلود نباید بیشتر از ۲۶ مگابایت باشد");
    }
    chunks.push(value);
  }
  try {
    return await new Response(Buffer.concat(chunks), {
      headers: { "Content-Type": request.headers.get("content-type") || "" },
    }).formData();
  } catch {
    throw new HttpError(400, "ساختار فرم آپلود نامعتبر است");
  }
}
export async function transformImage(file: File, kind: "poster" | "gallery") {
  if (
    !IMAGE_MIME_TYPES.includes(file.type as (typeof IMAGE_MIME_TYPES)[number])
  )
    throw new HttpError(400, "فقط JPEG، PNG و WebP مجاز است");
  if (file.size === 0) throw new HttpError(400, "تصویر خالی است");
  if (file.size > MAX_IMAGE_BYTES)
    throw new HttpError(413, "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد");
  const input = Buffer.from(await file.arrayBuffer());
  try {
    const image = sharp(input, {
      failOn: "warning",
      limitInputPixels: MAX_IMAGE_PIXELS,
    });
    const metadata = await image.metadata();
    if (
      !["jpeg", "png", "webp"].includes(metadata.format || "") ||
      (metadata.pages || 1) !== 1
    )
      throw new HttpError(400, "تصویر باید JPEG، PNG یا WebP ثابت باشد");
    const size = kind === "poster" ? 1200 : 1920;
    const result = await image
      .rotate()
      .resize({
        width: size,
        height: size,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84, effort: 4 })
      .toBuffer();
    if (result.byteLength > MAX_IMAGE_BYTES)
      throw new HttpError(413, "حجم تصویر پردازش‌شده بیش از حد مجاز است");
    return result;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(
      400,
      "فایل تصویر معتبر نیست یا ابعاد آن بیش از حد مجاز است",
    );
  }
}
export async function prepareContent(
  request: Request,
  previous?: MediaContent,
) {
  const created: string[] = [];
  let raw: unknown;
  let poster: File | undefined;
  const gallery: File[] = [];
  if (
    request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("multipart/form-data")
  ) {
    const form = await boundedMultipart(request);
    if (
      [...form.keys()].some(
        (key) => !["data", "poster", "gallery"].includes(key),
      )
    )
      throw new HttpError(400, "فیلد آپلود نامعتبر است");
    const fields = form.getAll("data");
    if (
      fields.length !== 1 ||
      typeof fields[0] !== "string" ||
      Buffer.byteLength(fields[0]) > 128 * 1024
    )
      throw new HttpError(400, "اطلاعات محتوا نامعتبر است");
    try {
      raw = JSON.parse(fields[0]);
    } catch {
      throw new HttpError(400, "اطلاعات محتوا نامعتبر است");
    }
    const posters = form.getAll("poster");
    if (posters.length > 1 || posters.some((value) => !(value instanceof File)))
      throw new HttpError(400, "فقط یک فایل پوستر مجاز است");
    poster = posters[0] as File | undefined;
    for (const value of form.getAll("gallery")) {
      if (!(value instanceof File))
        throw new HttpError(400, "فایل گالری نامعتبر است");
      gallery.push(value);
    }
  } else raw = await jsonBody(request);
  const payload = z.object({}).passthrough().parse(raw);
  const revision = z.number().int().nonnegative().optional().parse(payload.__v);
  if (previous && revision !== undefined && revision !== (previous.__v || 0))
    throw new HttpError(
      409,
      "این محتوا تغییر کرده است؛ صفحه را دوباره بارگذاری کنید",
    );
  const data = contentInput.parse({
    ...payload,
    ...(poster ? { poster: "/img/cinema.png" } : {}),
  });
  if (data.gallery.length + gallery.length > MAX_GALLERY_IMAGES)
    throw new HttpError(400, "حداکثر ۲۰ تصویر گالری مجاز است");
  const owned = new Set(
    contentMediaReferences(previous || {})
      .map(managedFilename)
      .filter(Boolean),
  );
  for (const reference of contentMediaReferences(data)) {
    const name = managedFilename(reference);
    if (name && !owned.has(name))
      throw new HttpError(
        400,
        "تصویر آپلودشده متعلق به این محتوا نیست؛ فایل را دوباره انتخاب کنید",
      );
  }
  data.poster = canonicalMediaReference(data.poster);
  data.gallery = data.gallery.map(canonicalMediaReference);
  try {
    const save = async (file: File, kind: "poster" | "gallery") => {
      const bytes = await transformImage(file, kind);
      await mkdir(mediaDirectory(), { recursive: true });
      const name = `${randomUUID()}.webp`;
      await writeFile(
        path.join(/* turbopackIgnore: true */ mediaDirectory(), name),
        bytes,
        {
          flag: "wx",
          mode: 0o600,
        },
      );
      created.push(name);
      return `/media/${name}`;
    };
    if (poster) data.poster = await save(poster, "poster");
    for (const file of gallery) data.gallery.push(await save(file, "gallery"));
    return {
      data: contentInput.parse(data),
      created,
      version: previous?.__v || 0,
    };
  } catch (error) {
    await discardCreatedMedia(created);
    throw error;
  }
}
export async function discardCreatedMedia(names: string[]) {
  for (const name of names) {
    if (!managedFilenamePattern.test(name)) continue;
    try {
      await unlink(
        path.join(/* turbopackIgnore: true */ mediaDirectory(), name),
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT")
        console.error("Media rollback failed:", name);
    }
  }
}
export async function mediaIsReferenced(name: string) {
  // Generated filenames are canonicalized in content writes. A substring match also
  // conservatively preserves references held by legacy trailers and settings.
  const pattern = escapeRegex(name);
  if (
    await Content.exists({
      $or: [{ poster: { $regex: pattern } }, { gallery: { $regex: pattern } }],
    })
  )
    return true;
  if (await Trailer.exists({ poster: { $regex: pattern } })) return true;
  const settings = await SiteSettings.find({}).select("value").lean();
  return settings.some((setting) =>
    JSON.stringify(setting.value)?.includes(name),
  );
}
export async function cleanupMedia(references: string[]) {
  for (const name of new Set(
    references.map(managedFilename).filter((name): name is string => !!name),
  )) {
    try {
      if (!(await mediaIsReferenced(name))) await discardCreatedMedia([name]);
    } catch {
      console.error("Media cleanup deferred:", name);
    }
  }
}
export async function readManagedImage(name: string) {
  if (!managedFilenamePattern.test(name)) return null;
  try {
    const filename = path.join(
      /* turbopackIgnore: true */ mediaDirectory(),
      name,
    );
    const info = await stat(filename);
    if (!info.isFile() || info.size > MAX_IMAGE_BYTES) return null;
    return await readFile(/* turbopackIgnore: true */ filename);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
export async function orphanMediaCandidates() {
  let names: string[];
  try {
    names = await readdir(/* turbopackIgnore: true */ mediaDirectory());
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const result: string[] = [];
  for (const name of names) {
    if (!managedFilenamePattern.test(name)) continue;
    const info = await stat(
      path.join(/* turbopackIgnore: true */ mediaDirectory(), name),
    );
    if (Date.now() - info.mtimeMs < 24 * 60 * 60 * 1000) continue;
    if (!(await mediaIsReferenced(name))) result.push(name);
  }
  return result;
}
