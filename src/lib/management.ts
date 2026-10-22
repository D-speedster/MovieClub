import { z } from "zod";
import { objectId } from "./content";
export const qualityOptions = [
  "480p",
  "720p",
  "1080p",
  "4K",
  "BluRay",
  "WEB-DL",
  "HDCAM",
] as const;
export const httpUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    try {
      return ["https:", "http:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "آدرس باید با http یا https شروع شود");
export const optionalHttpUrl = z.union([httpUrl, z.literal("")]).default("");
export const youtubeUrl = httpUrl.refine(
  (value) =>
    [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
      "www.youtube-nocookie.com",
      "youtube-nocookie.com",
    ].includes(new URL(value).hostname),
  "آدرس یوتیوب معتبر وارد کنید",
);
export const downloadInput = z
  .object({
    contentId: objectId,
    quality: z.enum(qualityOptions),
    size: z.string().trim().min(1).max(80),
    url: httpUrl,
    encoder: z.string().trim().max(80).default(""),
    subtitle: z.boolean().default(false),
    subtitleUrl: optionalHttpUrl,
    dubbed: z.boolean().default(false),
    label: z.string().trim().max(200).default(""),
    season: z.number().int().min(1).max(1000).nullable().default(null),
    episode: z.number().int().min(1).max(10000).nullable().default(null),
  })
  .superRefine((data, ctx) => {
    if ((data.season === null) !== (data.episode === null))
      ctx.addIssue({
        code: "custom",
        message: "فصل و قسمت باید با هم مشخص شوند",
      });
  });
export const trailerInput = z.object({
  title: z.string().trim().min(3).max(150),
  youtubeUrl,
  contentId: z.union([objectId, z.literal("")]).default(""),
  poster: z
    .union([
      httpUrl,
      z
        .string()
        .regex(/^[a-zA-Z0-9_.@%-]+$/)
        .max(255),
      z.literal(""),
    ])
    .default(""),
});
export const userInput = z.object({
  name: z.string().trim().min(3).max(100),
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_]{3,30}$/),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(72),
  role: z.enum(["User", "Admin", "Owner"]).default("User"),
});
export const moderationInput = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});
export const contactInput = z.object({ read: z.boolean() });
export const resources = [
  "trailers",
  "downloads",
  "users",
  "comments",
  "contacts",
] as const;
export type Resource = (typeof resources)[number];
export type DownloadInput = z.infer<typeof downloadInput>;
export type TrailerInput = z.infer<typeof trailerInput>;
export type AdminRow = {
  _id: string;
  title?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: "User" | "Admin" | "Owner";
  text?: string;
  rating?: number;
  status?: "pending" | "approved" | "rejected";
  message?: string;
  read?: boolean;
  contentId?: string | { _id: string; title: string; type: string } | null;
  youtubeUrl?: string;
  poster?: string;
  quality?: string;
  size?: string;
  url?: string;
  encoder?: string;
  subtitle?: boolean;
  subtitleUrl?: string;
  dubbed?: boolean;
  label?: string;
  season?: number | null;
  episode?: number | null;
  createdAt?: string;
};
export type PageData = {
  items: AdminRow[];
  total: number;
  page: number;
  pages: number;
};
export function isResource(value: string): value is Resource {
  return resources.includes(value as Resource);
}
