import { z } from "zod";
import { validImageReference, MAX_GALLERY_IMAGES } from "./media";
export const imageReference = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine(validImageReference, "آدرس تصویر نامعتبر است");
export const objectId = z
  .string()
  .regex(/^[a-f0-9]{24}$/i, "شناسه نامعتبر است");
export const contentInput = z.object({
  title: z.string().trim().min(3).max(150),
  type: z.enum(["movie", "series"]),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 2)
    .nullable()
    .optional(),
  description: z.string().trim().max(20000).default(""),
  poster: imageReference,
  genres: z.array(z.string().trim().min(1).max(80)).max(30),
  actors: z.array(z.string().trim().max(100)).max(100).default([]),
  directors: z.array(z.string().trim().max(100)).max(30).default([]),
  writers: z.array(z.string().trim().max(100)).max(30).default([]),
  countries: z.array(z.string().trim().max(100)).max(30).default([]),
  languages: z.array(z.string().trim().max(100)).max(30).default([]),
  gallery: z.array(imageReference).max(MAX_GALLERY_IMAGES).default([]),
  imdb: z.object({
    rating: z.number().min(0).max(10),
    votes: z.number().int().nonnegative().default(0),
  }),
  movie: z
    .object({ duration: z.number().int().nonnegative().max(2000) })
    .optional(),
  series: z
    .object({
      seasonsCount: z.number().int().nonnegative(),
      episodesCount: z.number().int().nonnegative(),
      isWeekly: z.boolean(),
      status: z.enum(["ongoing", "ended", "canceled"]),
    })
    .optional(),
});
export type ContentInput = z.infer<typeof contentInput>;
export type ContentDTO = ContentInput & {
  _id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
export function slugify(value: string) {
  return (
    value
      .normalize("NFKC")
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/[\s-]+/g, "-")
      .replace(/^-|-$/g, "") || "content"
  );
}
export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export function posterUrl(value: string) {
  if (!value) return "/img/cinema.png";
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  return `${process.env.NEXT_PUBLIC_IMAGE_ORIGIN || ""}/uploads/${encodeURIComponent(value)}`;
}
export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
export function parsePage(value?: string) {
  const parsed = Number(value ?? 1);
  return Number.isSafeInteger(parsed) && parsed > 0
    ? Math.min(parsed, 10000)
    : 1;
}

// Route params may already be decoded; tolerate both forms without throwing on malformed URLs.
export function decodeContentSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
