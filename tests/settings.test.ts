import { test } from "node:test";
import assert from "node:assert/strict";
import {
  settingsInput,
  settingsFromRecords,
  defaultSettings,
} from "../src/lib/settings";
test("settings bound featured IDs and reject active social URLs", () => {
  assert(
    !settingsInput.safeParse({
      ...defaultSettings,
      telegram: "javascript:alert(1)",
    }).success,
  );
  assert(
    !settingsInput.safeParse({
      ...defaultSettings,
      instagram: "https://user:secret@example.test/",
    }).success,
  );
  assert(
    !settingsInput.safeParse({
      ...defaultSettings,
      featuredIds: Array(13).fill("123456789012345678901234"),
    }).success,
  );
  assert(
    !settingsInput.safeParse({
      ...defaultSettings,
      featuredIds: ["123456789012345678901234", "123456789012345678901234"],
    }).success,
  );
  assert(
    settingsInput.safeParse({ ...defaultSettings, telegram: "", instagram: "" })
      .success,
  );
});
test("legacy settings retain hero filenames and ordered IDs while invalid values fall back", () => {
  const data = settingsFromRecords([
    { key: "hero_movies", value: "old-poster.jpg" },
    {
      key: "featured_content",
      value: [
        "123456789012345678901234",
        "invalid",
        "123456789012345678901234",
      ],
    },
    {
      key: "site_preferences",
      value: { siteName: "سینما", telegram: "javascript:bad" },
      __v: 7,
    },
  ]);
  assert.equal(data.heroes.movies, "old-poster.jpg");
  assert.equal(data.siteName, "سینما");
  assert.equal(data.telegram, defaultSettings.telegram);
  assert.equal(data.revision, 7);
  assert.deepEqual(data.featuredIds, ["123456789012345678901234"]);
  assert.equal(settingsFromRecords([]).heroes.movies, "");
});
