# MovieClub — Next.js rewrite

Single Next.js App Router application, React 19, TypeScript, MongoDB/Mongoose and Zod. No Express service, Create React App, separate frontend/backend packages or browser-held authentication token.

Development now continues directly on `main`, as requested. The Next.js foundation was merged in PR #1; the legacy application remains recoverable in Git history. This is an ongoing migration, not a feature-parity release. Existing collection names, content IDs, slugs, bcrypt passwords, posters and public assets are retained. Do not deploy over a live application until the remaining release gates are complete.

## Run

Use Node 22 or newer. From this repository root:

```bash
npm ci
cp .env.example .env.local
# Set MONGO_URI and SITE_URL in .env.local.
npm run db:indexes
npm run dev
```

`SITE_URL` must match the browser origin, including scheme and port, because state-changing requests enforce same-origin access. In production use HTTPS. MongoDB must use a replica set for transactional content deletion. Do not point development/testing at a production database.

```bash
npm run build
npm start
```

Production requires a Node-capable host and MongoDB; PHP-only shared hosting is insufficient. Build does not query a live database. Public catalog pages are server-rendered on request in this first stage. There is no persistent cross-request content cache yet; adding selective caching and invalidation follows functional parity.

## First owner

Set `OWNER_USERNAME`, `OWNER_NAME`, `OWNER_EMAIL` and `OWNER_PASSWORD` privately in `.env.local`, then run `npm run create-owner`. The script requires a password of at least 12 characters, refuses to promote an existing account and never logs the password. Remove these bootstrap variables afterwards. Existing users remain usable with their current bcrypt password. Old JWT cookies are intentionally ignored; users sign in again.

`npm run db:indexes` explicitly creates unique/TTL indexes. Resolve pre-existing duplicate usernames, emails or slugs before running it; the command fails rather than deleting data. Session expiration is checked in every request in addition to TTL cleanup.

## Current coverage

- Server-rendered home, movie/series/anime catalogs, genre/search and content detail pages, server pagination, metadata/canonical, JSON-LD, sitemap and robots.
- Existing public CSS tokens, typography, hero artwork, posters and header/footer/card design reused. Visual parity is **not yet verified**; home layout and admin UI require comparison and completion.
- Login/register/logout with opaque database-backed sessions, HttpOnly cookies, live user-role checks, same-origin mutations, server input validation and shared MongoDB rate limits.
- Material UI 7 admin shell with scoped dark/light themes, desktop sidebar and mobile drawer. Dashboard metrics come from the database. Protected content lists/create/edit/delete and server-checked user role operations; Owner accounts cannot be deleted or demoted.
- Dedicated trailer CRUD, download CRUD with series season/episode validation, paginated user management, moderation and a contact inbox with read/unread state. Lists support server-side search/filtering and pagination; no bulk download of all users is required.
- Admin/Owner site settings with effective SEO/text/social preferences, four page banners, ordered featured content, revision checks and transactional saves.
- Secure poster/gallery uploads, previews, WebP conversion, reference-aware cleanup and server-rendered galleries.
- Moderated comments and persisted contact messages. New comments remain pending until a manager approves them. Approved/rejected status affects public server-rendered content pages.

## Remaining migration work

See [docs/MIGRATION.md](docs/MIGRATION.md). In particular: verify full visual parity; complete the richer content editor; collections; OMDB/TMDB import; truthful analytics; subscription/payment decisions; automated browser/accessibility/visual checks. These capabilities are not claimed to be complete. Existing download links and approved comments already render on content pages.

## Validation

```bash
npm run typecheck
npm test
npm run build
npm run test:integration
# Optional real browser checks, after installing Playwright Chromium:
npx playwright install chromium
npm run test:browser
```

Integration tests launch a production Next server on localhost:3107 and a disposable MongoDB replica set, seed only temporary data and remove it afterwards. `mongodb-memory-server` may download its MongoDB binary on the first run. Integration tests require local process/network permissions. They do not use `MONGO_URI` or modify the user's database.

## Source layout

```text
src/app/          Pages, metadata routes and API route handlers
src/components/  Server/client components
src/server/      Server-only auth, data queries and Mongoose models
src/lib/         Validation, types and shared pure helpers
src/styles/      Styles retained from the old UI
public/          Existing images, fonts and posters
scripts/         Explicit database indexes and secure owner bootstrap
```

Image optimization is deliberately disabled on migrated poster components until remote image origins and deployment storage are finalized. The app does not fetch arbitrary poster URLs on the server. Existing files in `public/uploads` are retained for compatibility; new uploads use the persistent directory configured by `UPLOAD_DIR` and are served through `/media/[filename]`.

Optional browser tests use the same disposable database and production server. Set `CHROME_EXECUTABLE_PATH` to use an existing Chromium executable. Browser screenshots are saved to the OS temporary directory for inspection, not uploaded or committed.

## Poster and gallery uploads

The Material UI content editor saves JPEG, PNG and static WebP files with the content in one multipart request. Each input is limited to 5 MiB / 25 million pixels; the whole request is limited to 26 MiB, with at most 20 gallery images. Files are decoded and re-encoded as WebP, stripped of metadata, resized to at most 1200px (poster) or 1920px (gallery), and assigned random filenames. Uploaded URLs are scoped to the content that owns them; legacy filenames and HTTP(S) images remain supported. Gallery images are server-rendered on content pages.

Use a persistent writable `UPLOAD_DIR` (default `./.data/uploads`), shared by all app instances. Back up that directory with MongoDB. Uploads require Admin/Owner authentication and same-origin requests, with 30 multipart requests per account per 15-minute window. Replacing/removing media and transactional content deletion clean up unreferenced generated files; legacy files are never automatically deleted. Editor revision checks prevent stale saves from overwriting a newer edit.

An interrupted process can leave orphan files. `npm run media:cleanup` reports generated files older than 24 hours without database references; `npm run media:cleanup -- --apply` checks references again and removes candidates. Run against the same database and upload directory as the app. Runtime files are excluded from Git and deployment tracing; deployments must mount the persistent directory rather than bundle uploaded files.

## Site settings

Open `/admin/settings` as Admin/Owner. Set the site name/SEO description, homepage text, footer/social links, page banners and up to 12 ordered featured titles (search covers the full catalog). Settings take effect in server-rendered pages after saving; they do not change `SITE_URL` or deployment environment variables. Blank social URLs hide their links. Removing the home banner restores the default artwork; other page banners disappear when empty. Banners share the secure image limits/storage/cleanup described above. MongoDB replica-set transactions and the unique SiteSettings key index created by `npm run db:indexes` are required. Existing legacy hero filenames and featured selections remain supported.
