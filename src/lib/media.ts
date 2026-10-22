export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_UPLOAD_BYTES = 26 * 1024 * 1024;
export const MAX_GALLERY_IMAGES = 20;
export const MAX_IMAGE_PIXELS = 25_000_000;
export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const managedFilenamePattern =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.webp$/i;
export function managedFilename(reference: string): string | null {
  try {
    const pathname = decodeURIComponent(
      new URL(reference, "http://media.local").pathname,
    );
    if (!pathname.startsWith("/media/")) return null;
    const name = pathname.slice("/media/".length);
    return managedFilenamePattern.test(name) ? name : null;
  } catch {
    return null;
  }
}
export function validImageReference(value: string) {
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return !url.username && !url.password;
    } catch {
      return false;
    }
  }
  if (/^[a-zA-Z0-9_.@%-]+$/.test(value) && value !== "." && value !== "..")
    return true;
  if (!/^\/(img|uploads|media)\//.test(value)) return false;
  try {
    const decoded = decodeURIComponent(value);
    return (
      !decoded.includes(String.fromCharCode(92)) &&
      !/[\u0000-\u001f?#]/.test(decoded) &&
      !decoded.split("/").some((part) => part === ".." || part === ".")
    );
  } catch {
    return false;
  }
}
export function canonicalMediaReference(value: string) {
  const name = managedFilename(value);
  return name ? `/media/${name}` : value;
}
