import { z } from "zod";
import { imageReference, objectId } from "./content";
export const heroKeys = ["home", "movies", "series", "anime"] as const;
export type HeroKey = (typeof heroKeys)[number];
const social = z.union([
  z.literal(""),
  z
    .url()
    .max(500)
    .refine((value) => {
      const url = new URL(value);
      return (
        ["http:", "https:"].includes(url.protocol) &&
        !url.username &&
        !url.password
      );
    }, "فقط آدرس HTTP یا HTTPS مجاز است"),
]);
export const settingsInput = z.object({
  siteName: z.string().trim().min(2).max(80),
  description: z.string().trim().min(3).max(300),
  heroTitle: z.string().trim().min(2).max(150),
  heroSubtitle: z.string().trim().max(300),
  footerText: z.string().trim().max(300),
  telegram: social,
  instagram: social,
  heroes: z.object({
    home: z.union([z.literal(""), imageReference]),
    movies: z.union([z.literal(""), imageReference]),
    series: z.union([z.literal(""), imageReference]),
    anime: z.union([z.literal(""), imageReference]),
  }),
  featuredIds: z
    .array(objectId.transform((value) => value.toLowerCase()))
    .max(12)
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "محتوای ویژه تکراری است",
    ),
  revision: z.number().int().nonnegative(),
});
export type SettingsDTO = z.infer<typeof settingsInput>;
export const defaultSettings: SettingsDTO = {
  siteName: "مووی کلاب",
  description: "اطلاعات، معرفی و دانلود فیلم و سریال در مووی کلاب",
  heroTitle: "دنیای فیلم و سریال",
  heroSubtitle: "فیلم بعدی‌ات را پیدا کن",
  footerText: "تمامی حقوق محفوظ است.",
  telegram: "https://t.me/movieclub",
  instagram: "https://instagram.com/movieclub",
  heroes: { home: "", movies: "", series: "", anime: "" },
  featuredIds: [],
  revision: 0,
};
export const defaultHomeHero =
  "/img/hero/tron-ares-jared-leto-hd-wallpaper-uhdpaper.com-418@5@i.jpg";
export function settingsFromRecords(
  records: { key: string; value: unknown; __v?: number }[],
): SettingsDTO {
  const preferences = records.find((row) => row.key === "site_preferences");
  const raw =
    preferences?.value && typeof preferences.value === "object"
      ? (preferences.value as Record<string, unknown>)
      : {};
  const result = {
    ...defaultSettings,
    heroes: { ...defaultSettings.heroes },
    featuredIds: [],
    revision: preferences?.__v || 0,
  } as SettingsDTO;
  for (const key of [
    "siteName",
    "description",
    "heroTitle",
    "heroSubtitle",
    "footerText",
    "telegram",
    "instagram",
  ] as const) {
    const field = settingsInput.shape[key].safeParse(raw[key]);
    if (field.success) result[key] = field.data;
  }
  for (const key of heroKeys) {
    const value = records.find((row) => row.key === `hero_${key}`)?.value;
    const field = settingsInput.shape.heroes.shape[key].safeParse(value);
    if (field.success) result.heroes[key] = field.data;
  }
  const featured = records.find((row) => row.key === "featured_content")?.value;
  if (Array.isArray(featured))
    result.featuredIds = [
      ...new Set(
        featured
          .map((value) => String(value).toLowerCase())
          .filter((id) => objectId.safeParse(id).success),
      ),
    ].slice(0, 12);
  return result;
}
