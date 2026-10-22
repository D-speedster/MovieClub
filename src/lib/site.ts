export function siteUrl() {
  const url = new URL(process.env.SITE_URL || "http://localhost:3000");
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid SITE_URL");
  return url;
}
