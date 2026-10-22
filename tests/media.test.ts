import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validImageReference,
  managedFilename,
  canonicalMediaReference,
} from "../src/lib/media";
const name = "12345678-abcd-4abc-8abc-123456789abc.webp";
test("image references preserve legacy files and safe public URLs", () => {
  for (const value of [
    "old-poster.jpg",
    "/uploads/old.jpg",
    "/img/cinema.png",
    `/media/${name}`,
    "https://example.test/image.jpg",
  ])
    assert(validImageReference(value), value);
  for (const value of [
    "javascript:alert(1)",
    "data:image/png;base64,a",
    "//evil.test/x",
    "/uploads/../secret",
    "/uploads/%2e%2e/secret",
    "/uploads/a%5cb.jpg",
    "/uploads/a%00b.jpg",
    "/other/a.jpg",
  ])
    assert(!validImageReference(value), value);
});
test("managed filenames are UUID WebP paths only", () => {
  assert.equal(managedFilename(`/media/${name}`), name);
  assert.equal(
    canonicalMediaReference(`https://site.test/media/${name}`),
    `/media/${name}`,
  );
  for (const value of [
    "/uploads/old.jpg",
    "/media/../../secret",
    "/media/not-a-uuid.webp",
    `/media/${name}/extra`,
  ])
    assert.equal(managedFilename(value), null);
});

import { decodeContentSlug } from "../src/lib/content";
test("content URLs tolerate encoded and decoded Persian route parameters", () => {
  const slug = "فیلم-آزمایشی";
  assert.equal(decodeContentSlug(encodeURIComponent(slug)), slug);
  assert.equal(decodeContentSlug(slug), slug);
  assert.equal(decodeContentSlug("%malformed"), "%malformed");
});
