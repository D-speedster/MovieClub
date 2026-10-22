import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import { hash } from "bcryptjs";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
async function main() {
  const origin = "http://127.0.0.1:3107";
  const db = await MongoMemoryReplSet.create({
    replSet: { count: 1, ip: "127.0.0.1" },
    instanceOpts: [{ args: ["--nounixsocket"] }],
  });
  let server: ReturnType<typeof spawn> | undefined;
  let output = "";
  try {
    const uri = db.getUri("movieclub_integration");
    await mongoose.connect(uri);
    const database = mongoose.connection.db!;
    await database
      .collection("ratebuckets")
      .createIndex({ key: 1 }, { unique: true });
    await database
      .collection("sessions")
      .createIndex({ tokenHash: 1 }, { unique: true });
    await database
      .collection("contents")
      .createIndex({ slug: 1 }, { unique: true });
    const userId = new mongoose.Types.ObjectId(),
      ownerId = new mongoose.Types.ObjectId(),
      contentId = new mongoose.Types.ObjectId();
    const password = "Test-only-password-2026";
    await database.collection("users").insertMany([
      {
        _id: userId,
        name: "مدیر آزمایشی",
        username: "admin_test",
        email: "admin@example.test",
        password: await hash(password, 10),
        role: "Admin",
      },
      {
        _id: ownerId,
        name: "مالک آزمایشی",
        username: "owner_test",
        email: "owner@example.test",
        password: await hash(password, 10),
        role: "Owner",
      },
    ]);
    await database
      .collection("contents")
      .insertOne({
        _id: contentId,
        title: "فیلم تست رندر سرور",
        slug: "server-render-test",
        type: "movie",
        year: 2026,
        poster: "1780293224671-poster.jpg",
        description: "خلاصه قابل مشاهده در HTML اولیه",
        genres: ["Drama"],
        actors: [],
        directors: ["Test Director"],
        writers: [],
        languages: ["فارسی"],
        countries: [],
        gallery: [],
        imdb: { rating: 8, votes: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    server = spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        "3107",
      ],
      {
        env: { ...process.env, MONGO_URI: uri, SITE_URL: origin },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    server.stdout?.on("data", (d) => {
      output += d;
    });
    server.stderr?.on("data", (d) => {
      output += d;
    });
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Server startup timeout " + output)),
        20000,
      );
      const timer = setInterval(() => {
        if (output.includes("Ready in")) {
          clearInterval(timer);
          clearTimeout(timeout);
          resolve();
        }
      }, 50);
      server!.once("exit", () => {
        clearInterval(timer);
        clearTimeout(timeout);
        reject(new Error(output));
      });
    });
    const request = (
      url: string,
      method = "GET",
      body?: unknown,
      cookie?: string,
    ) =>
      fetch(origin + url, {
        method,
        headers: {
          ...(method !== "GET"
            ? { Origin: origin, "Content-Type": "application/json" }
            : {}),
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        redirect: "manual",
      });
    const movie = await request("/movie/server-render-test");
    assert.equal(movie.status, 200);
    const html = await movie.text();
    assert(html.includes("<h1"));
    assert(html.includes("فیلم تست رندر سرور"));
    assert(html.includes("خلاصه قابل مشاهده در HTML اولیه"));
    assert(html.includes("application/ld+json"));
    assert(html.includes('rel="canonical"'));
    console.log(
      "PASS: initial movie HTML includes title, summary, canonical and JSON-LD",
    );
    const home = await (await request("/")).text();
    assert(home.includes("فیلم تست رندر سرور"));
    console.log("PASS: home renders database contents on server");
    const redirect = await request("/Movies");
    assert.equal(redirect.status, 308);
    assert(redirect.headers.get("location")?.includes("/movies"));
    console.log("PASS: old catalog URL redirects permanently");
    assert.equal((await request("/api/content", "POST", {})).status, 401);
    console.log("PASS: unauthenticated content writes rejected");
    const csrf = await fetch(origin + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin_test", password }),
    });
    assert.equal(csrf.status, 403);
    console.log("PASS: mutation without trusted origin rejected");
    const login = await request("/api/auth/login", "POST", {
      username: "admin_test",
      password,
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get("set-cookie")!.split(";")[0];
    assert(login.headers.get("set-cookie")!.includes("HttpOnly"));
    console.log("PASS: existing bcrypt password logs in with HttpOnly session");
    const role = await request(
      `/api/users/${ownerId}`,
      "PUT",
      { role: "User" },
      cookie,
    );
    assert.equal(role.status, 403);
    const del = await request(
      `/api/users/${ownerId}`,
      "DELETE",
      undefined,
      cookie,
    );
    assert.equal(del.status, 403);
    console.log("PASS: Admin cannot demote or delete Owner");
    const create = await request(
      "/api/content",
      "POST",
      {
        title: "محتوای جدید آزمایشی",
        type: "movie",
        poster: "poster.jpg",
        genres: [],
        imdb: { rating: 0 },
      },
      cookie,
    );
    assert.equal(create.status, 201);
    const created = await create.json();
    assert(created.slug);
    console.log(
      "PASS: authenticated content creation persists zero rating and slug",
    );
    assert.equal(
      (
        await request("/api/auth/register", "POST", {
          username: "bad_test",
          name: "کاربر تست",
          email: "bad@example.test",
          password: "1",
        })
      ).status,
      400,
    );
    console.log("PASS: weak password rejected on server");
    const comment = await request(
      "/api/comments",
      "POST",
      { contentId: String(contentId), text: "دیدگاه تست" },
      cookie,
    );
    assert.equal(comment.status, 201);
    assert.equal(
      (await database.collection("comments").findOne({ contentId }))?.status,
      "pending",
    );
    console.log("PASS: comments enter moderation");
    const contact = await request("/api/contact", "POST", {
      name: "کاربر آزمایشی",
      email: "test@example.test",
      message: "پیام تماس برای تست یکپارچه",
    });
    assert.equal(contact.status, 201);
    assert.equal(
      await database.collection("contactmessages").countDocuments(),
      1,
    );
    console.log("PASS: contact success follows database persistence");
    const sitemap = await (await request("/sitemap.xml")).text();
    assert(sitemap.includes("/movie/server-render-test"));
    console.log("PASS: sitemap contains canonical content URL");

    for (const resource of [
      "trailers",
      "downloads",
      "users",
      "comments",
      "contacts",
    ])
      assert.equal((await request(`/api/admin/${resource}`)).status, 401);
    console.log("PASS: management lists require authentication");
    const regular = await request(
      "/api/admin/users",
      "POST",
      {
        name: "کاربر معمولی",
        username: "regular_test",
        email: "regular@example.test",
        password: "regular-password-2026",
        role: "User",
      },
      cookie,
    );
    assert.equal(regular.status, 201);
    const regularData = await regular.json();
    assert(!("password" in regularData));
    const regularLogin = await request("/api/auth/login", "POST", {
      username: "regular_test",
      password: "regular-password-2026",
    });
    const regularCookie = regularLogin.headers.get("set-cookie")!.split(";")[0];
    assert.equal(
      (await request("/api/admin/users", "GET", undefined, regularCookie))
        .status,
      403,
    );
    assert.equal(
      (
        await request(
          "/api/admin/trailers",
          "POST",
          { title: "تریلر کاربر", youtubeUrl: "https://youtu.be/test123" },
          regularCookie,
        )
      ).status,
      403,
    );
    console.log(
      "PASS: regular users cannot access management or create trailers",
    );
    const deniedOwner = await request(
      "/api/admin/users",
      "POST",
      {
        name: "مالک غیرمجاز",
        username: "denied_owner",
        email: "denied@example.test",
        password: "test-password-2026",
        role: "Owner",
      },
      cookie,
    );
    assert.equal(deniedOwner.status, 403);
    const userList = await (
      await request("/api/admin/users", "GET", undefined, cookie)
    ).json();
    assert(
      userList.items.every(
        (user: Record<string, unknown>) => !("password" in user),
      ),
    );
    assert.equal(userList.total, 3);
    assert.equal(
      (await request(`/api/users/${userId}`, "PUT", { role: "User" }, cookie))
        .status,
      403,
    );
    assert.equal(
      (
        await request(
          `/api/users/${regularData._id}`,
          "PUT",
          { role: "Admin" },
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(
      (await request("/api/auth/me", "GET", undefined, regularCookie)).status,
      401,
    );
    assert.equal(
      (
        await request(
          `/api/users/${regularData._id}`,
          "DELETE",
          undefined,
          cookie,
        )
      ).status,
      200,
    );
    console.log(
      "PASS: user administration hides passwords, protects roles and revokes sessions",
    );
    const trailerPayload = {
      title: "تریلر مستقل تست",
      youtubeUrl: "https://www.youtube.com/watch?v=abc123",
      contentId: String(contentId),
    };
    const trailerResponse = await request(
      "/api/admin/trailers",
      "POST",
      trailerPayload,
      cookie,
    );
    assert.equal(trailerResponse.status, 201);
    const trailerData = await trailerResponse.json();
    assert.equal(
      await database.collection("contents").countDocuments({ _id: contentId }),
      1,
    );
    assert.equal(
      (
        await request(
          `/api/admin/trailers/${trailerData._id}`,
          "PATCH",
          { ...trailerPayload, title: "تریلر ویرایش شده" },
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await request(
          `/api/admin/trailers/${trailerData._id}`,
          "DELETE",
          undefined,
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(
      await database.collection("contents").countDocuments({ _id: contentId }),
      1,
    );
    console.log(
      "PASS: trailer create/edit/delete never deletes the linked movie",
    );
    assert.equal(
      (
        await request(
          "/api/admin/trailers",
          "POST",
          { ...trailerPayload, youtubeUrl: "https://youtube.com.evil.test" },
          cookie,
        )
      ).status,
      400,
    );
    const seriesResponse = await request(
      "/api/content",
      "POST",
      {
        title: "سریال تست مدیریت",
        type: "series",
        poster: "poster.jpg",
        genres: [],
        imdb: { rating: 7 },
      },
      cookie,
    );
    assert.equal(seriesResponse.status, 201);
    const seriesData = await seriesResponse.json();
    const downloadPayload = {
      contentId: seriesData._id,
      quality: "1080p",
      size: "1 GB",
      url: "https://downloads.example.test/episode.mp4",
      season: 1,
      episode: 2,
    };
    assert.equal(
      (
        await request(
          "/api/admin/downloads",
          "POST",
          { ...downloadPayload, contentId: String(contentId) },
          cookie,
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await request(
          "/api/admin/downloads",
          "POST",
          { ...downloadPayload, url: "javascript:alert(1)" },
          cookie,
        )
      ).status,
      400,
    );
    const downloadResponse = await request(
      "/api/admin/downloads",
      "POST",
      downloadPayload,
      cookie,
    );
    assert.equal(downloadResponse.status, 201);
    const downloadData = await downloadResponse.json();
    assert.equal(
      (
        await request(
          `/api/admin/downloads/${downloadData._id}`,
          "PATCH",
          { ...downloadPayload, size: "2 GB", quality: "720p" },
          cookie,
        )
      ).status,
      200,
    );
    const links = await (
      await request(
        `/api/admin/downloads?contentId=${seriesData._id}`,
        "GET",
        undefined,
        cookie,
      )
    ).json();
    assert.equal(links.total, 1);
    assert.equal(links.items[0].contentId.title, "سریال تست مدیریت");
    assert.equal(links.items[0].size, "2 GB");
    assert.equal(
      (
        await request(
          "/api/admin/downloads?contentId=invalid",
          "GET",
          undefined,
          cookie,
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await request(
          `/api/admin/downloads/${downloadData._id}`,
          "DELETE",
          undefined,
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(
      await database.collection("downloadlinks").countDocuments(),
      0,
    );
    console.log(
      "PASS: download CRUD validates protocols, episodes, parent content and filters",
    );
    const pending = await (
      await request(
        "/api/admin/comments?status=pending",
        "GET",
        undefined,
        cookie,
      )
    ).json();
    assert.equal(pending.total, 1);
    const commentId = pending.items[0]._id;
    assert.equal(
      (
        await request(
          `/api/admin/comments/${commentId}`,
          "PATCH",
          { status: "approved" },
          cookie,
        )
      ).status,
      200,
    );
    assert(
      (await (await request("/movie/server-render-test")).text()).includes(
        "دیدگاه تست",
      ),
    );
    assert.equal(
      (
        await request(
          `/api/admin/comments/${commentId}`,
          "PATCH",
          { status: "invalid" },
          cookie,
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await request(
          `/api/admin/comments/${commentId}`,
          "PATCH",
          { status: "rejected" },
          cookie,
        )
      ).status,
      200,
    );
    assert(
      !(await (await request("/movie/server-render-test")).text()).includes(
        "دیدگاه تست",
      ),
    );
    console.log(
      "PASS: moderation controls publication in server-rendered movie HTML",
    );
    const inbox = await (
      await request("/api/admin/contacts?read=false", "GET", undefined, cookie)
    ).json();
    assert.equal(inbox.total, 1);
    const messageId = inbox.items[0]._id;
    assert.equal(
      (
        await request(
          `/api/admin/contacts/${messageId}`,
          "PATCH",
          { read: true },
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await (
          await request(
            "/api/admin/contacts?read=false",
            "GET",
            undefined,
            cookie,
          )
        ).json()
      ).total,
      0,
    );
    assert.equal(
      (
        await request(
          `/api/admin/contacts/${messageId}`,
          "DELETE",
          undefined,
          cookie,
        )
      ).status,
      200,
    );
    console.log(
      "PASS: contact inbox supports read state, filtering and deletion",
    );
    await database
      .collection("trailers")
      .insertMany(
        Array.from({ length: 22 }, (_, i) => ({
          title: `Pagination ${i}`,
          youtubeUrl: "https://youtu.be/test123",
          createdAt: new Date(),
        })),
      );
    const secondPage = await (
      await request("/api/admin/trailers?page=2", "GET", undefined, cookie)
    ).json();
    assert.equal(secondPage.items.length, 2);
    assert.equal(secondPage.total, 22);
    assert.equal(secondPage.pages, 2);
    assert.equal(
      (await request("/api/admin/trailers?q=%5B", "GET", undefined, cookie))
        .status,
      200,
    );
    console.log(
      "PASS: admin pagination includes older records and treats regex as literal text",
    );
    for (const resource of [
      "trailers",
      "downloads",
      "users",
      "comments",
      "contacts",
    ]) {
      const page = await request(
        `/admin/${resource}`,
        "GET",
        undefined,
        cookie,
      );
      assert.equal(page.status, 200);
      const markup = await page.text();
      assert(markup.includes("admin-sidebar"));
      assert(!markup.includes("global-header__logo"));
    }
    console.log(
      "PASS: all admin management screens render inside the protected admin shell",
    );
    if (process.env.RUN_BROWSER === "1") {
      const { chromium } = await import("@playwright/test");
      const browser = await chromium.launch({
        headless: true,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || undefined,
        args: ["--no-sandbox", "--disable-dev-shm-usage", "--no-zygote"],
      });
      try {
        const context = await browser.newContext({
          viewport: { width: 1440, height: 1000 },
        });
        await context.addCookies([
          {
            name: cookie.split("=")[0],
            value: cookie.split("=")[1],
            domain: "127.0.0.1",
            path: "/",
            httpOnly: true,
            sameSite: "Lax",
          },
        ]);
        const page = await context.newPage();
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(origin + "/admin/trailers");
        await page.getByRole("button", { name: "افزودن", exact: true }).click();
        await page.screenshot({
          path: join(tmpdir(), "movieclub-admin-dialog.png"),
          fullPage: true,
        });
        await page
          .getByRole("dialog")
          .getByLabel(/^عنوان/)
          .fill("تریلر ساخته شده در مرورگر");
        await page
          .getByRole("dialog")
          .getByLabel("آدرس یوتیوب")
          .fill("https://youtu.be/browser123");
        await page.getByRole("button", { name: "ذخیره", exact: true }).click();
        await page.getByText("تغییرات ذخیره شد", { exact: true }).waitFor();
        await page
          .getByRole("cell", {
            name: "تریلر ساخته شده در مرورگر",
            exact: false,
          })
          .waitFor();
        await page.screenshot({
          path: join(tmpdir(), "movieclub-admin-desktop.png"),
          fullPage: false,
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await page
          .getByRole("button", { name: "باز کردن منوی مدیریت" })
          .click();
        await page.getByRole("button", { name: "بستن منوی مدیریت" }).waitFor();
        await page.getByRole("button", { name: "بستن منوی مدیریت" }).click();
        await page
          .getByRole("button", { name: "بستن منوی مدیریت" })
          .waitFor({ state: "hidden" });
        await page.screenshot({
          path: join(tmpdir(), "movieclub-admin-mobile.png"),
          fullPage: false,
        });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth + 1,
          ),
        );
        assert.deepEqual(errors, []);
        console.log(
          "PASS: browser creates a trailer and responsive desktop/mobile shell has no page errors",
        );
      } finally {
        await browser.close();
      }
    }
    const deleted = await request(
      `/api/content/${contentId}`,
      "DELETE",
      undefined,
      cookie,
    );
    assert.equal(deleted.status, 200);
    assert.equal(
      await database.collection("comments").countDocuments({ contentId }),
      0,
    );
    console.log("PASS: content deletion removes dependencies in transaction");
    const logout = await request("/api/auth/logout", "POST", undefined, cookie);
    assert.equal(logout.status, 200);
    assert.equal(
      (await request("/api/auth/me", "GET", undefined, cookie)).status,
      401,
    );
    console.log("PASS: logout revokes server-side session");
    console.log(
      `${process.env.RUN_BROWSER === "1" ? 24 : 23} integration scenarios passed using a disposable MongoDB replica set.`,
    );
  } catch (e) {
    console.error(output);
    throw e;
  } finally {
    server?.kill("SIGTERM");
    await mongoose.disconnect();
    await db.stop();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
