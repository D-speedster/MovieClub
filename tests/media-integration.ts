import assert from "node:assert/strict";
import sharp from "sharp";
import type mongoose from "mongoose";
import { readdir } from "node:fs/promises";
export async function testMedia(
  origin: string,
  cookie: string,
  database: NonNullable<typeof mongoose.connection.db>,
  directory: string,
) {
  const png = await sharp({
    create: { width: 1800, height: 1300, channels: 3, background: "#762fac" },
  })
    .png()
    .toBuffer();
  const payload = {
    title: "فیلم آپلود آزمایشی",
    type: "movie",
    poster: "/img/cinema.png",
    genres: ["Drama"],
    gallery: [],
    imdb: { rating: 7, votes: 0 },
  };
  const send = (
    data: unknown,
    images: { field: string; buffer: Buffer; type?: string }[] = [],
    id?: string,
    auth = true,
  ) => {
    const body = new FormData();
    body.set("data", JSON.stringify(data));
    for (const image of images)
      body.append(
        image.field,
        new Blob([new Uint8Array(image.buffer)], {
          type: image.type || "image/png",
        }),
        "../../unsafe.png",
      );
    return fetch(origin + `/api/content${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      headers: { Origin: origin, ...(auth ? { Cookie: cookie } : {}) },
      body,
    });
  };
  const count = async () => {
    try {
      return (await readdir(directory)).length;
    } catch {
      return 0;
    }
  };
  assert.equal(
    (await send(payload, [{ field: "poster", buffer: png }], undefined, false))
      .status,
    401,
  );
  assert.equal(await count(), 0);
  assert.equal(
    (
      await send(payload, [
        {
          field: "poster",
          buffer: Buffer.from("<html>fake</html>"),
          type: "image/jpeg",
        },
      ])
    ).status,
    400,
  );
  assert.equal(
    (
      await send(payload, [
        { field: "poster", buffer: Buffer.alloc(5 * 1024 * 1024 + 1) },
      ])
    ).status,
    413,
  );
  assert.equal(await count(), 0);
  console.log(
    "PASS: uploads require authentication, decode actual images and enforce size limits",
  );
  const result = await send(payload, [
    { field: "poster", buffer: png },
    { field: "gallery", buffer: png },
  ]);
  assert.equal(result.status, 201, await result.clone().text());
  const item = await result.json();
  assert.equal(await count(), 2);
  assert.match(item.poster, /^\/media\/[a-f0-9-]+\.webp$/);
  const response = await fetch(origin + item.poster);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/webp");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  const metadata = await sharp(
    Buffer.from(await response.arrayBuffer()),
  ).metadata();
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 1200);
  assert(!metadata.exif);
  const detailResponse = await fetch(
    origin + `/movie/${encodeURIComponent(item.slug)}`,
  );
  assert.equal(detailResponse.status, 200);
  const html = await detailResponse.text();
  assert(html.includes("گالری تصاویر"));
  assert(html.includes(item.gallery[0]));
  console.log(
    "PASS: poster/gallery become bounded WebP and gallery renders in initial HTML",
  );
  assert.equal((await send({ ...payload, poster: item.poster })).status, 400);
  assert.equal(
    (await send({ ...payload, poster: origin + item.poster })).status,
    400,
  );
  assert.equal(await count(), 2);
  console.log(
    "PASS: managed images cannot be adopted by another content record",
  );
  assert.equal(
    (
      await send(
        { ...item, gallery: [] },
        [
          { field: "poster", buffer: png },
          { field: "gallery", buffer: Buffer.from("fake") },
        ],
        item._id,
      )
    ).status,
    400,
  );
  assert.equal(await count(), 2);
  assert.equal(
    (
      await send(
        { ...item, gallery: Array(21).fill("/img/cinema.png") },
        [],
        item._id,
      )
    ).status,
    400,
  );
  console.log(
    "PASS: failed upload batches roll back files and gallery count is bounded",
  );
  const updated = await send(
    item,
    [{ field: "poster", buffer: png }],
    item._id,
  );
  assert.equal(updated.status, 200, await updated.clone().text());
  const next = await updated.json();
  assert.equal((await fetch(origin + item.poster)).status, 404);
  assert.equal((await fetch(origin + item.gallery[0])).status, 200);
  assert.equal(await count(), 2);
  assert.equal(
    (await send(item, [{ field: "poster", buffer: png }], item._id)).status,
    409,
  );
  assert.equal(await count(), 2);
  console.log(
    "PASS: replacement cleans old posters, retains gallery and rejects stale editor saves",
  );
  const noGallery = await send({ ...next, gallery: [] }, [], item._id);
  assert.equal(noGallery.status, 200);
  assert.equal((await fetch(origin + item.gallery[0])).status, 404);
  assert.equal(await count(), 1);
  // A historic shared reference must survive deletion of its first owner.
  const sibling = await database
    .collection("contents")
    .insertOne({ ...payload, slug: "shared-media-test", poster: next.poster });
  assert.equal(
    (
      await fetch(origin + `/api/content/${item._id}`, {
        method: "DELETE",
        headers: { Origin: origin, Cookie: cookie },
      })
    ).status,
    200,
  );
  assert.equal((await fetch(origin + next.poster)).status, 200);
  assert.equal(
    (
      await fetch(origin + `/api/content/${sibling.insertedId}`, {
        method: "DELETE",
        headers: { Origin: origin, Cookie: cookie },
      })
    ).status,
    200,
  );
  assert.equal((await fetch(origin + next.poster)).status, 404);
  assert.equal(await count(), 0);
  console.log(
    "PASS: gallery removal and transactional delete clean files while preserving shared references",
  );
  return 6;
}
