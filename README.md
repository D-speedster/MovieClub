# MovieClub — Next.js rewrite

Single Next.js App Router application, React 19, TypeScript, MongoDB/Mongoose and Zod. No Express service, Create React App, separate frontend/backend packages or browser-held authentication token.

This branch is **migration stage 1**, not feature-parity completion. `main` retains the old application. Existing collection names, content IDs, slugs, bcrypt passwords, posters and public assets are retained. This branch must not replace the deployed application yet.

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
- Protected admin content list/create/edit and APIs for transactional deletion and protected user-role operations. Owners cannot be deleted/demoted through the user API.
- Moderated comments and persisted contact messages. Comments are pending until approved; the moderation UI is pending migration.

## Remaining migration work

See [docs/MIGRATION.md](docs/MIGRATION.md). In particular: restore full MUI admin design; migrate trailer, download, user and comment management screens; collections; featured/hero/page settings; image upload and deletion lifecycle; OMDB/TMDB import; truthful analytics; subscription/payment decisions; automated browser/accessibility/visual checks. These capabilities are not claimed to be complete. Existing download links and approved comments already render on content pages.

## Validation

```bash
npm run typecheck
npm test
npm run build
npm run test:integration
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

Image optimization is deliberately disabled on migrated poster components until remote image origins and deployment storage are finalized. The app does not fetch arbitrary poster URLs on the server. Existing files in `public/uploads` are retained for compatibility; new uploads and storage are pending.
