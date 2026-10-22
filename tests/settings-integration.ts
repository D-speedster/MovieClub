import { randomBytes, createHash } from "node:crypto";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import sharp from "sharp";
export async function testSettings(
  origin: string,
  cookie: string,
  database: NonNullable<typeof mongoose.connection.db>,
  contentId: string,
) {
  const regularId = new mongoose.Types.ObjectId();
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const regularCookie = `movieclub_session=${token}`;
  await database
    .collection("users")
    .insertOne({
      _id: regularId,
      name: "Settings regular user",
      username: "settings_regular",
      email: "settings@example.test",
      role: "User",
    });
  await database
    .collection("sessions")
    .insertOne({
      userId: regularId,
      tokenHash,
      expiresAt: new Date(Date.now() + 60000),
    });
  const request = (
    method = "GET",
    body?: unknown,
    auth = cookie,
    trusted = true,
  ) =>
    fetch(origin + "/api/admin/settings", {
      method,
      headers: {
        ...(auth ? { Cookie: auth } : {}),
        ...(trusted ? { Origin: origin } : {}),
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  assert.equal((await request("GET", undefined, "")).status, 401);
  assert.equal((await request("GET", undefined, regularCookie)).status, 403);
  assert.equal((await request("PUT", {}, cookie, false)).status, 403);
  assert.equal((await request("PUT", {}, regularCookie)).status, 403);
  assert.equal(
    (await fetch(origin + "/admin/settings", { headers: { Cookie: cookie } }))
      .status,
    200,
  );
  console.log(
    "PASS: settings page/API require management role and same-origin writes",
  );
  await database.collection("users").deleteOne({ _id: regularId });
  await database.collection("sessions").deleteOne({ tokenHash });
  const before = await (await request()).json();
  const legacyId = new mongoose.Types.ObjectId();
  await database.collection("contents").insertOne({
    _id: legacyId,
    title: "محتوای ویژه دوم",
    slug: "featured-second",
    type: "movie",
    poster: "/img/cinema.png",
    genres: [],
    actors: [],
    directors: [],
    writers: [],
    languages: [],
    countries: [],
    gallery: [],
    imdb: { rating: 0 },
  });
  const changed = {
    ...before,
    siteName: "سینمای آزمایشی",
    description: "توضیحات سئو آزمایشی",
    heroTitle: "عنوان مدیریت‌شده",
    heroSubtitle: "متن بنر مدیریت‌شده",
    footerText: "فوتر آزمایشی",
    telegram: "https://t.me/movieclub_test",
    instagram: "",
    featuredIds: [String(legacyId), contentId],
    heroes: { ...before.heroes, movies: "old-poster.jpg" },
  };
  let response = await request("PUT", changed);
  assert.equal(response.status, 200, await response.clone().text());
  let current = await response.json();
  let home = await (await fetch(origin + "/")).text();
  assert(home.includes("عنوان مدیریت‌شده"));
  assert(home.includes("توضیحات سئو آزمایشی"));
  assert(home.includes("فوتر آزمایشی"));
  assert(home.includes("https://t.me/movieclub_test"));
  assert(!home.includes("https://instagram.com/movieclub"));
  assert(home.includes("<title>سینمای آزمایشی"));
  const featured = home.slice(home.indexOf('aria-label="پیشنهادهای ویژه"'));
  assert(
    featured.indexOf("/movie/featured-second") <
      featured.indexOf("/movie/server-render-test"),
  );
  assert(featured.includes("/movie/server-render-test"));
  const catalog = await (await fetch(origin + "/movies")).text();
  assert(catalog.includes("/uploads/old-poster.jpg"));
  console.log(
    "PASS: text, SEO, social links, legacy banners and ordered featured cards affect server HTML",
  );
  assert.equal(
    (await request("PUT", { ...current, telegram: "javascript:alert(1)" }))
      .status,
    400,
  );
  assert.equal(
    (
      await request("PUT", {
        ...current,
        featuredIds: [String(new mongoose.Types.ObjectId())],
      })
    ).status,
    400,
  );
  assert.equal((await request("PUT", changed)).status, 409);
  assert.deepEqual(
    (await (await request()).json()).featuredIds,
    current.featuredIds,
  );
  console.log(
    "PASS: invalid IDs/URLs and stale settings writes fail without partial changes",
  );
  const png = await sharp({
    create: { width: 1200, height: 600, channels: 3, background: "#543bc8" },
  })
    .png()
    .toBuffer();
  const upload = (data: unknown, files: { key: string; bytes: Buffer }[]) => {
    const body = new FormData();
    body.set("data", JSON.stringify(data));
    for (const file of files)
      body.set(
        file.key,
        new Blob([new Uint8Array(file.bytes)], { type: "image/png" }),
        "banner.png",
      );
    return fetch(origin + "/api/admin/settings", {
      method: "PUT",
      headers: { Origin: origin, Cookie: cookie },
      body,
    });
  };
  response = await upload(current, [
    { key: "hero_home", bytes: png },
    { key: "hero_movies", bytes: png },
  ]);
  assert.equal(response.status, 200, await response.clone().text());
  current = await response.json();
  assert.equal((await fetch(origin + current.heroes.home)).status, 200);
  home = await (await fetch(origin + "/")).text();
  assert(home.includes(current.heroes.home));
  assert(
    (await (await fetch(origin + "/movies")).text()).includes(
      current.heroes.movies,
    ),
  );
  assert.equal(
    (
      await request("PUT", {
        ...current,
        heroes: {
          ...current.heroes,
          series: "/media/12345678-abcd-4abc-8abc-123456789abc.webp",
        },
      })
    ).status,
    400,
  );
  console.log(
    "PASS: uploaded hero files render on home/catalog and unrelated managed URLs are rejected",
  );
  const oldHero = current.heroes.home;
  response = await upload(current, [{ key: "hero_home", bytes: png }]);
  assert.equal(response.status, 200);
  current = await response.json();
  assert.equal((await fetch(origin + oldHero)).status, 404);
  assert.equal((await fetch(origin + current.heroes.movies)).status, 200);
  response = await upload(current, [
    { key: "hero_home", bytes: png },
    { key: "hero_series", bytes: Buffer.from("invalid image") },
  ]);
  assert.equal(response.status, 400);
  assert.equal((await fetch(origin + current.heroes.home)).status, 200);
  assert.equal((await (await request()).json()).revision, current.revision);
  const concurrent = await Promise.all([
    request("PUT", { ...current, heroSubtitle: "تغییر اول" }),
    request("PUT", { ...current, heroSubtitle: "تغییر دوم" }),
  ]);
  assert.deepEqual(concurrent.map((row) => row.status).sort(), [200, 409]);
  current = await (await request()).json();
  console.log(
    "PASS: image replacement, failed batches and concurrent saves preserve committed settings",
  );
  const removed = [current.heroes.home, current.heroes.movies];
  response = await request("PUT", {
    ...current,
    heroes: { home: "", movies: "", series: "", anime: "" },
    featuredIds: [contentId],
  });
  assert.equal(response.status, 200);
  for (const url of removed)
    assert.equal((await fetch(origin + url)).status, 404);
  await database.collection("contents").deleteOne({ _id: legacyId });
  home = await (await fetch(origin + "/")).text();
  assert(home.includes("tron-ares-jared-leto"));
  assert(
    !(await (await fetch(origin + "/movies")).text()).includes(
      'class="catalog-banner"',
    ),
  );
  console.log(
    "PASS: banner removal cleans generated files and restores default home artwork",
  );
  return 6;
}
