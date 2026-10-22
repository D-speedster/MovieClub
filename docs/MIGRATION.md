# Migration tracking

Baseline: `c91d1873c6eb238ae49fe89ee393db062e2c7f5b` (`main`). The foundation was merged into `main` in PR #1; subsequent development continues on `main` by explicit user instruction. The earlier upload-security work remains in the other worktree/branch and is not overwritten.

## Stage 1: working vertical slice

- [x] One root package, Next App Router, TypeScript and MongoDB
- [x] Existing model/collection compatibility, assets and public styles
- [x] Server-rendered home/catalog/detail and canonical content URLs
- [x] Registration and existing-user login; revocable database sessions
- [x] Server-protected content create/edit and transactional delete API
- [x] Same-origin mutations, Zod validation, fixed-window shared rate limiting
- [x] Owner protection in user APIs
- [x] Approved comments displayed, new comments pending, contact persistence
- [x] Production build, pure tests and temporary-database integration harness

## Stage 2: UI and feature parity (pending)

- [ ] Pixel/behavior comparison on desktop/mobile; restore full original layout
- [x] Port core Material UI dashboard, navigation, themes and management controls to React 19 (full visual parity still pending)
- [x] Content editor poster/gallery upload, preview, WebP normalization and lifecycle cleanup
- [ ] Rich series seasons/episodes editor and OMDB/TMDB
- [x] Dedicated Trailer CRUD; never delete Content from trailer screens
- [x] Download CRUD and episode organization
- [x] User list, creation and role/delete screens
- [x] Comment moderation and contact inbox
- [x] Ordered featured content, page hero images and effective text/SEO/social settings
- [ ] Collections schema/CRUD and public collection pages
- [ ] Public account experience, menus and redirects audit
- [ ] Decide whether subscriptions, payments/news and analytics belong in this release

## Stage 3: release gate (pending)

- [ ] Test backup restoration and migration against a **copy** of real data
- [ ] Audit historic fields, relative gallery URLs and legacy poster formats
- [ ] Confirm deployment host, canonical domain and image storage
- [x] Safe upload/file deletion and orphan cleanup (persistent deployment storage still needs confirmation)
- [ ] Pagination-aware sitemap splitting beyond 45,000 content documents
- [ ] Persistent public content caching and write invalidation
- [ ] Browser, keyboard, accessibility and visual regression checks
- [ ] Full permission matrix and rate-limit concurrency/load checks
- [ ] Payment/gated-download policy if a paid model is enabled
- [ ] Deploy only after parity review and release checks

## Compatibility notes

`Content`, `User`, `Comment`, `DownloadLink`, `SiteSettings` and `Trailer` retain their original model names. The default MongoDB pluralized collection names therefore stay the same. New `Session`, `RateBucket` and `ContactMessage` models add collections; no migration script edits/deletes existing records automatically.

An `_id` URL is redirected to the existing slug. Case-sensitive legacy redirects are handled explicitly in `src/proxy.ts` to avoid case-insensitive redirect loops. User self-management and modification/deletion of Owner accounts are disallowed through normal user management.

New comments default to pending. Existing approved comments remain visible. The moderation screen now supports pending, approved and rejected states. Content deletion requires a MongoDB replica set and removes dependencies transactionally; on unsupported databases it fails rather than intentionally performing a partial delete.

The retained local posters are not newly uploaded user data. Payment gating and external metadata imports are not yet implemented. New uploads use generated WebP files in persistent UPLOAD_DIR, separate from retained legacy assets. Current public pages do not have a subscription restriction; do not configure this branch as a paid service.

## Stage 2 management coverage

Dedicated `/api/admin/trailers` mutations only touch Trailer documents. Download writes require HTTP(S) URLs and valid content references; season and episode must be specified together and are allowed only for series. User lists exclude password hashes. Creating an Owner requires an existing Owner, and existing Owner/self protection remains enforced on the server. Server-rendered admin data is protected independently of client-side navigation.

The dashboard reports actual content/users/pending comments/unread contacts and grouped registration counts. Registration groups are Gregorian months in Asia/Tehran and explicitly labeled; no fake traffic numbers or random user growth chart is displayed.

## Site settings

The Admin/Owner screen at `/admin/settings` controls the public site name, SEO description, homepage heading/subheading, footer text/social links, four page banners, and up to 12 ordered featured content IDs. Settings are read during server rendering, with no persistent public cache. Existing `hero_movies`, `hero_series` (and home/anime variants) filename values and `featured_content` arrays remain readable. New text preferences live under `site_preferences` in the existing SiteSettings collection.

All settings are committed in one MongoDB transaction with an editor revision check. Banners reuse the bounded WebP upload pipeline and reference-aware cleanup; replacing/removing them leaves legacy files intact. Empty social URLs hide their links. An empty home banner restores the original artwork; empty catalog banners hide that section. Rich page content editing and collections remain separate migration tasks.
