import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import { Content, Comment, DownloadLink } from "./models";
import { escapeRegex, objectId, type ContentDTO } from "@/lib/content";
export function serialize<T>(value: unknown): T { return JSON.parse(JSON.stringify(value)); }
export async function listContent({ type, q = "", genre, page = 1, limit = 20 }: { type?: "movie" | "series"; q?: string; genre?: string; page?: number; limit?: number } = {}) {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (type) filter.type = type;
  if (genre === "anime") filter.genres = { $regex: "anime|animation|انیمه|انیمیشن", $options: "i" };
  else if (genre) filter.genres = genre;
  if (q) filter.title = { $regex: escapeRegex(q.slice(0, 120)), $options: "i" };
  const size = Math.max(1, Math.min(limit, 50));
  const [items, total] = await Promise.all([
    Content.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * size).limit(size).lean(),
    Content.countDocuments(filter),
  ]);
  return { items: serialize<ContentDTO[]>(items), total, page, pages: Math.ceil(total / size) };
}
export const getContent = cache(async (slug: string) => {
  await connectDB();
  const item = await Content.findOne({ slug }).lean() || (objectId.safeParse(slug).success ? await Content.findById(slug).lean() : null);
  return item ? serialize<ContentDTO>(item) : null;
});
export async function getRelatedData(id: string) {
  await connectDB();
  const [downloads, comments] = await Promise.all([
    DownloadLink.find({ contentId: id }).sort({ season: 1, episode: 1, quality: 1 }).lean(),
    Comment.find({ contentId: id, status: "approved" }).sort({ createdAt: -1 }).limit(50).lean(),
  ]);
  return serialize<{ downloads: { _id: string; url: string; quality: string; size: string; subtitleUrl?: string; season?: number; episode?: number }[]; comments: { _id: string; username: string; text: string; rating?: number }[] }>({ downloads, comments });
}
