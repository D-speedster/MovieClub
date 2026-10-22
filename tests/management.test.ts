import { test } from "node:test";
import assert from "node:assert/strict";
import {
  downloadInput,
  trailerInput,
  moderationInput,
  userInput,
  httpUrl,
} from "../src/lib/management";
const id = "0123456789abcdef01234567";
const download = {
  contentId: id,
  quality: "1080p",
  size: "1.5 GB",
  url: "https://downloads.example.test/movie.mp4",
};
test("download links reject active URL schemes", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "file:///etc/passwd",
    "not-a-url",
  ])
    assert.equal(httpUrl.safeParse(url).success, false);
  assert.equal(downloadInput.safeParse(download).success, true);
  assert.equal(
    downloadInput.safeParse({ ...download, subtitleUrl: "javascript:alert(1)" })
      .success,
    false,
  );
});
test("episode and season must form a valid pair", () => {
  assert.equal(
    downloadInput.safeParse({ ...download, season: 1, episode: 2 }).success,
    true,
  );
  assert.equal(
    downloadInput.safeParse({ ...download, season: 1 }).success,
    false,
  );
  assert.equal(
    downloadInput.safeParse({ ...download, season: 0, episode: 2 }).success,
    false,
  );
  assert.equal(
    downloadInput.safeParse({ ...download, season: 1, episode: 1.2 }).success,
    false,
  );
});
test("trailer input accepts dedicated youtube data without requiring a content poster", () => {
  const trailer = {
    title: "تریلر تست",
    youtubeUrl: "https://www.youtube.com/watch?v=abc123",
  };
  assert.equal(trailerInput.safeParse(trailer).success, true);
  for (const youtubeUrl of [
    "https://youtube.com.evil.test/watch",
    "https://example.test/video",
    "javascript:alert(1)",
  ])
    assert.equal(
      trailerInput.safeParse({ ...trailer, youtubeUrl }).success,
      false,
    );
});
test("moderation accepts only supported transitions and strips unrelated fields", () => {
  assert.equal(moderationInput.safeParse({ status: "invalid" }).success, false);
  assert.deepEqual(moderationInput.parse({ status: "approved", userId: id }), {
    status: "approved",
  });
});
test("admin user input rejects operator objects and unsupported roles", () => {
  const user = {
    name: "کاربر تست",
    username: "tester",
    email: "test@example.test",
    password: "test-password",
  };
  assert.equal(userInput.safeParse(user).success, true);
  assert.equal(
    userInput.safeParse({ ...user, username: { $ne: null } }).success,
    false,
  );
  assert.equal(
    userInput.safeParse({ ...user, role: "SuperAdmin" }).success,
    false,
  );
});
