# Implementation Plan: CSS Theme Rewrite

## Overview

This plan consolidates the CSS token system into a single source of truth (`design-system.css`), removes all Netflix-red and non-theme hardcoded colors from every component, fixes all undefined CSS variable references, trims the over-aggressive `global-theme.css`, applies RTL logical properties across layout components, and validates every invariant with property-based tests using `fast-check`.

Tasks are ordered so that the token foundation is in place before any component file is touched, and the PBT infrastructure is wired up early so each component fix is immediately verifiable.

---

## Tasks

- [x] 1. Consolidate CSS token foundation
  - [x] 1.1 Merge `colors.css` `:root` block into `design-system.css` and add missing tokens
    - Remove the entire `:root { ... }` block from `src/theme/colors.css`
    - In `src/styles/design-system.css`, add the CTA token group inside the existing `BLACK & GOLD COLOR SYSTEM` `:root` block:
      - `--cta-primary: #C9A24D`
      - `--cta-hover: #D6B66A`
      - `--cta-text: #0E0E0E`
    - Confirm `--bg-primary: #0E0E0E` alias already exists (it does); leave it
    - Confirm `--border-primary`, `--border-secondary`, `--text-tertiary` already exist; leave them
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 1.2 Write unit tests verifying token values in `design-system.css`
    - Create `src/__tests__/css-tokens.test.js`
    - Assert `--bg-primary` is `#0E0E0E`, `--text-secondary` is `#E0E0E0`, `--cta-primary` is `#C9A24D`
    - Assert `colors.css` contains no `:root {` block
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Set up property-based test infrastructure
  - [x] 2.1 Install `fast-check` and create the property test file scaffold
    - Run `npm install --save-dev fast-check@3` inside `Frontend/`
    - Create `src/__tests__/css-theme.property.test.js` with the `CSS_FILES_IN_SCOPE` array and placeholder `it.todo` stubs for Properties 1–7
    - The file should import `fc` from `fast-check` and `fs`, `path` from Node core
    - _Requirements: 3.6, 2.8_

  - [x] 2.2 Implement Property 2 — No Undefined Variable References (run first as a baseline)
    - In `css-theme.property.test.js`, implement the `fc.assert` for Property 2
    - Pattern: `/var\(--accent-primary\)|var\(--bg-tertiary\)|var\(--accent-secondary\)/g`
    - **Property 2: No Undefined CSS Variable References**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.6**

  - [x] 2.3 Add CI check script for grep-based regression guard
    - Create `scripts/check-css-theme.sh` (bash) or `scripts/check-css-theme.js` (Node) that:
      1. Greps all component CSS for Netflix reds
      2. Greps for undefined var references
      3. Checks `colors.css` has no `:root`
      4. Checks `global-theme.css` has no `!important` outside `html`/`body`/`#root`/`.App`
    - Add `"check:css": "node scripts/check-css-theme.js"` to `package.json` scripts
    - _Requirements: 3.6_

- [x] 3. Clean up `global-theme.css`
  - [x] 3.1 Remove all over-scoped `!important` rule blocks from `global-theme.css`
    - Delete every rule block whose selector is NOT `html`, `body`, `#root`, or `.App`; keep only those four selectors with `!important`
    - Replace the removed component-specific blocks with the cleaned form described in the design: keep form element rules (`.form-control`, `input`, `textarea`, `select`) but **without** `!important`
    - Blocks to delete (see design §"Блоки حذف‌شده"): `.row .col ...`, `span div p h1...`, `button:not(.btn-cta)...`, `[style*=...]` attribute selectors, all component-specific selectors (`.movie-item`, `.nav-menu`, `.search-box`, `.footer`, `.modal`, `.dropdown`, `.table`, `.pagination`, `.tabs`, `.sidebar`)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.3_

  - [ ]* 3.2 Write property test — Property 6: No `!important` outside html/body/#root
    - In `css-theme.property.test.js`, implement Property 6
    - Parse `global-theme.css`, for each rule block whose selector does not match `html|body|#root|\.App`, assert no `!important` present
    - **Property 6: No !important Outside html/body/#root in global-theme.css**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [x] 4. Checkpoint — token foundation and global theme
  - Ensure `npm test -- --watchAll=false` passes with the unit tests from task 1.2 and the Property 2 / Property 6 stubs
  - Ensure `node scripts/check-css-theme.js` exits 0 for `colors.css` (`:root` removed) and `global-theme.css` (`!important` scope)
  - Ask the user if anything looks wrong before touching component files.

- [x] 5. Fix `Header.css`
  - [x] 5.1 Replace all undefined variables and hardcoded colors in `Header.css`
    - `var(--accent-primary)` → `var(--gold-primary)` (nav-link hover svg, mobile-nav-link hover svg, search-button background, spinner border-top, scrollbar thumb)
    - `var(--accent-primary)` hover on search-button → `var(--gold-muted)`
    - `var(--bg-tertiary)` → `var(--bg-surface)` (search-input background, mobile-nav background)
    - `var(--accent-secondary)` → `var(--gold-soft)` (search-result-item rating)
    - `#B20710` hardcoded → `var(--gold-muted)` (search-button hover background, scrollbar thumb hover)
    - `rgba(229, 9, 20, 0.1)` focus box-shadow → `rgba(201, 162, 77, 0.2)`
    - _Requirements: 3.1, 2.8_

  - [x] 5.2 Apply RTL logical properties and remove redundant declarations in `Header.css`
    - Change `.header__search-button` position: `right: var(--space-2)` → `inset-inline-end: var(--space-2)`
    - Change `.header__search-input` padding: replace the physical shorthand with `padding-inline-start: var(--space-4); padding-inline-end: var(--space-12)`
    - Delete the entire `[dir="rtl"] .header__search-button` and `[dir="rtl"] .header__search-input` override blocks (superseded by logical properties)
    - Remove `font-style: normal`, `font-variant: normal`, `text-transform: none`, and `background-color: rgba(0, 0, 0, 0)` from `.header__nav-link` and `.header__mobile-nav-link`
    - _Requirements: 5.1, 5.2, 7.1, 7.2_

  - [x] 5.3 Fix focus states in `Header.css`
    - Change all `:focus` selectors for nav links, search button, and mobile toggle to `:focus-visible`
    - Replace `outline: 2px solid var(--accent-primary)` with `outline: 2px solid var(--gold-primary)`
    - _Requirements: 6.3, 6.5_

- [x] 6. Fix `MobileNav.css`
  - [x] 6.1 Replace undefined variables in `MobileNav.css`
    - `var(--accent-primary)` → `var(--gold-primary)` in: `.mobile-nav__item--active .mobile-nav__icon`, `.mobile-nav__indicator`, high-contrast media query
    - _Requirements: 3.2_

  - [x] 6.2 Fix focus selector and RTL indicator in `MobileNav.css`
    - Change `.mobile-nav__item:focus` → `.mobile-nav__item:focus-visible`
    - Change `.mobile-nav__indicator`: replace `left: 50%` with `inset-inline-start: 50%`
    - _Requirements: 6.4, 5.7_

- [ ] 7. Rewrite `MovieCard.css`
  - [x] 7.1 Replace all hardcoded colors with tokens in `MovieCard.css`
    - `/* 🎬 NETFLIX-STYLE MOVIE CARD */` comment → `/* movie-card */`
    - Card background `#1e293b` → `var(--bg-surface)`
    - Poster skeleton gradient stops `#1e293b` / `#334155` → `var(--bg-surface)` / `var(--bg-hover)`
    - Poster error background `#1e293b` → `var(--bg-surface)`
    - Poster error text `#64748b` → `var(--text-muted)`
    - Rating badge border and color `#FFC107` → `var(--gold-primary)` (both border and color)
    - Rating badge background `rgba(255,193,7,0.15)` → `rgba(201,162,77,0.15)`
    - Rating svg color `#FFC107` → `var(--gold-primary)`
    - Title `#f1f5f9` → `var(--text-primary)`
    - Quality badge text `#f1f5f9` → `var(--text-primary)`
    - Year badge text `#f1f5f9` → `var(--text-primary)`
    - Play button background `rgba(229,9,20,0.9)` → `var(--cta-primary)` (with 0.9 opacity via `rgba` or directly token)
    - Play button hover `#e50914` → `var(--cta-primary)`
    - _Requirements: 2.1, 8.1, 7.4_

  - [~] 7.2 Apply RTL logical property for year badge in `MovieCard.css`
    - Replace `.netflix-movie-card__year-badge` `left: 10px` → `inset-inline-start: 10px`
    - Delete the `[dir="rtl"] .netflix-movie-card__year-badge` override block (superseded)
    - _Requirements: 5.7_

  - [~] 7.3 Fix focus state in `MovieCard.css`
    - `.netflix-movie-card__link:focus-visible` outline: `#e50914` → `var(--gold-primary)`
    - _Requirements: 6.2_

- [ ] 8. Rewrite `MovieSlider.css`
  - [x] 8.1 Replace all hardcoded colors with tokens in `MovieSlider.css`
    - `.ms-title` color `#f1f5f9` → `var(--text-primary)`
    - `.ms-title::after` background `#e50914` → `var(--gold-primary)`
    - `.ms-viewall` color `#94a3b8` → `var(--text-tertiary)`
    - `.ms-viewall:hover` border-color `#e50914` → `var(--gold-primary)`, background `rgba(229,9,20,0.08)` → `rgba(201,162,77,0.08)`, color `#ffffff` → `var(--text-primary)`
    - `.ms-nav` background `rgba(15, 23, 42, 0.85)` → `rgba(14, 14, 14, 0.85)`, color `#cbd5e1` → `var(--text-tertiary)`
    - `.ms-nav:hover` background and border-color `#e50914` → `var(--gold-primary)`, color `#fff` → `var(--text-primary)`
    - All skeleton gradients: `#1e293b` → `var(--bg-surface)`, `#334155` → `var(--bg-hover)` (title-skeleton, viewall-skeleton, card-skeleton)
    - _Requirements: 2.2, 8.2_

  - [x] 8.2 Fix RTL nav button positioning in `MovieSlider.css`
    - `.ms-nav--prev` `right: 0` → `inset-inline-start: 0`
    - `.ms-nav--next` `left: 0` → `inset-inline-end: 0`
    - _Requirements: 5.3_

- [ ] 9. Rewrite `HeroSection.css`
  - [-] 9.1 Replace all hardcoded Netflix-red and non-theme colors with tokens in `HeroSection.css`
    - `.hero-header__logo-accent` / `.hero-drawer__logo-accent` color `#e50914` → `var(--gold-primary)`
    - `.hero-header__logo-text`, `.hero-drawer__logo`, `.hero-header__logo-text` font-family `'Segoe UI', Arial, sans-serif` → `var(--font-primary)`
    - `.hero-header__subscribe-btn` bg `#e50914` / hover `#c40812` → `var(--cta-primary)` / `var(--cta-hover)`
    - `.hero-feature svg` color `#e50914` → `var(--gold-primary)`
    - `.hero-section__cta-btn` bg `#e50914` / hover `#c40812`, box-shadow `rgba(229,9,20,0.35)` / hover `rgba(229,9,20,0.45)` → `var(--cta-primary)` / `var(--cta-hover)`, `rgba(201,162,77,0.35)` / `rgba(201,162,77,0.45)`
    - `.hero-drawer` background `#0f172a` → `var(--bg-surface)`
    - `.hero-drawer__subscribe-btn` bg `#e50914` / hover `#c40812` → `var(--cta-primary)` / `var(--cta-hover)`
    - `.hero-section--loading` background `#0a0a0a` → `var(--bg-main)`
    - Shimmer skeleton gradient `#1e293b` / `#334155` → `var(--bg-surface)` / `var(--bg-hover)`
    - Other slate colors (`#cbd5e1`, `#94a3b8`, `#f1f5f9`) in hero content area → `var(--text-tertiary)`, `var(--text-muted)`, `var(--text-primary)` respectively
    - _Requirements: 2.3, 5.5, 5.6, 8.3_

  - [~] 9.2 Apply RTL logical properties for drawer link border in `HeroSection.css`
    - `.hero-drawer__link` `border-right: 3px solid transparent` → `border-inline-end: 3px solid transparent`
    - `.hero-drawer__link:hover` `border-right-color: #e50914` → `border-inline-end-color: var(--gold-primary)`
    - `.hero-drawer__link:hover` `padding-right: 28px` → `padding-inline-end: 28px`
    - _Requirements: 5.4_

  - [~] 9.3 Fix focus states in `HeroSection.css`
    - All `:focus-visible` outline selectors: replace `#e50914` → `var(--gold-primary)`
    - _Requirements: 6.1_

- [ ] 10. Fix `SearchOverlay.css`
  - [-] 10.1 Replace all hardcoded backgrounds and color values in `SearchOverlay.css`
    - `.search-overlay__box` background `#1a1a2e` → `var(--bg-surface)`
    - `.search-overlay__icon` color `#888` → `var(--text-muted)`
    - `.search-overlay__close` color `#888` → `var(--text-muted)`; hover `#fff` → `var(--text-primary)`
    - `.search-overlay__status` color `#888` → `var(--text-muted)`
    - `.search-overlay__input` color `#fff` → `var(--text-primary)`
    - `.search-overlay__input::placeholder` color `#666` → `var(--text-muted)`
    - `.search-overlay__title` color `#fff` → `var(--text-primary)`
    - `.search-overlay__meta` color `#888` → `var(--text-muted)`
    - `.search-overlay__poster` background `#2a2a4a` → `var(--bg-hover)`
    - `.search-overlay__item:hover` background `rgba(255,255,255,0.06)` → `var(--bg-hover)` (or leave semi-transparent — document choice)
    - _Requirements: 2.5_

- [ ] 11. Fix `Footer.css`
  - [-] 11.1 Replace all hardcoded colors and font-family in `Footer.css`
    - `.site-footer` background `#0a0a0a` → `var(--bg-main)`
    - `.site-footer__logo-text` and `.site-footer__logo-accent` font-family `'Segoe UI', Arial, sans-serif` → `var(--font-primary)`
    - `.site-footer__logo-accent` color `#e50914` → `var(--gold-primary)`
    - `.site-footer__nav-link` color `#9ca3af` → `var(--text-tertiary)`; hover `#ffffff` → `var(--text-primary)`
    - `.site-footer__social-btn` color `#9ca3af` → `var(--text-tertiary)`
    - `.site-footer__social-btn:hover` background `#e50914` → `var(--gold-primary)`, color `#ffffff` → `var(--bg-main)` (text on gold)
    - `.site-footer__copy` and `.site-footer__status` color `#6b7280` → `var(--text-muted)`
    - _Requirements: 2.4, 5.5_

- [x] 12. Fix `Movies.css`
  - [x] 12.1 Replace hardcoded hero gradients and fix `btn-retry` in `Movies.css`
    - `.movies-static-hero` base background gradient (blue tones) → `linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-hover) 100%)`
    - `.movies-static-hero__background` gradient (brown tones) → `linear-gradient(to bottom, var(--bg-main) 0%, var(--bg-surface) 100%)`
    - `.movies-static-hero__content` color `#f1f5f9` → `var(--text-primary)`
    - `.btn-retry` background `var(--accent-primary)` → `var(--gold-primary)`
    - `.btn-retry:hover` background `#B20710` → `var(--cta-hover)`, box-shadow `rgba(229, 9, 20, 0.3)` → `rgba(201, 162, 77, 0.3)`
    - _Requirements: 2.6, 3.3_

- [x] 13. Fix `Series.css`
  - [x] 13.1 Replace hardcoded hero gradients and fix `btn-retry` in `Series.css`
    - `.series-static-hero` base gradient (purple/green tones) → `linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-hover) 100%)`
    - `.series-static-hero__background` gradient (blue tones) → `linear-gradient(to bottom, var(--bg-main) 0%, var(--bg-surface) 100%)`
    - `.series-static-hero__content` color `#f1f5f9` → `var(--text-primary)`
    - `.btn-retry` background `var(--accent-primary)` → `var(--gold-primary)`
    - `.btn-retry:hover` background `#B20710` → `var(--cta-hover)`, box-shadow `rgba(229, 9, 20, 0.3)` → `rgba(201, 162, 77, 0.3)`
    - _Requirements: 2.7, 3.4_

- [ ] 14. Fix `Home.redesigned.css`
  - [x] 14.1 Align `--bg-primary` → `--bg-main` in `Home.redesigned.css`
    - Replace every instance of `var(--bg-primary)` with `var(--bg-main)` throughout the file
    - _Requirements: 3.5_

- [~] 15. Checkpoint — component CSS complete
  - Ensure `npm test -- --watchAll=false` passes all existing tests
  - Run `node scripts/check-css-theme.js`; exit must be 0
  - Ask the user if any visual regressions should be checked before running all PBT assertions

- [ ] 16. Implement all remaining property-based tests
  - [~] 16.1 Implement Property 1 — No Netflix Red in any component CSS
    - Regex: `/#e50914|#c40812|#B20710|#b20710/gi`
    - **Property 1: No Netflix Red in Component CSS**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 6.1, 6.2**

  - [~] 16.2 Implement Property 3 — No Hardcoded Non-Theme Hex Colors
    - Forbidden palette: `#1e293b`, `#334155`, `#64748b`, `#f1f5f9`, `#94a3b8`, `#cbd5e1`, `#FFC107`, `#ffc107`, `#1a1a2e`, `#0a0a0a`, `#9ca3af`, `#6b7280`, `#1b2951`, `#2980b9`, `#2d1b69`, `#16213e`, `#0f3460`, `#0f172a`
    - **Property 3: No Hardcoded Non-Theme Hex Colors**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 8.1, 8.2, 8.3**

  - [~] 16.3 Implement Property 4 — Focus States Use Gold Token
    - Extract `:focus` and `:focus-visible` blocks; assert any `outline` declaration uses `var(--gold-primary)`, not a hardcoded color
    - **Property 4: Focus States Use Gold Token**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

  - [~] 16.4 Implement Property 5 — Skeleton Animations Use Theme Tokens
    - For files containing `shimmer` or `skeleton`, assert no `#1e293b` or `#334155`
    - **Property 5: Skeleton Animations Use Theme Tokens**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**

  - [~] 16.5 Implement Property 7 — Layout Components Use Logical CSS Properties
    - For Header, MobileNav, HeroSection, Footer, MovieSlider files: assert that `inset-inline-` is used in place of `right:`/`left:` for positioned RTL-sensitive elements; specifically assert the old physical overrides are absent in each file
    - **Property 7: Layout Components Use Logical CSS Properties**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.7**

- [~] 17. Final checkpoint — all tests green
  - Run `npm test -- --watchAll=false`; all property tests and unit tests must pass
  - Run `node scripts/check-css-theme.js`; exit 0
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP pass
- Each task references specific requirements for traceability
- Checkpoints (tasks 4, 15, 17) ensure incremental validation at logical breakpoints
- Property tests use `fc.constantFrom(...CSS_FILES_IN_SCOPE)` so each "run" tests a specific file — `numRuns` is set to `CSS_FILES_IN_SCOPE.length`
- The CI script (`scripts/check-css-theme.js`) provides a fast grep-level regression guard independent of the test suite
- `colors.css` utility classes (`.bg-main`, `.text-gold`, `.btn-cta`, `.card`, `.input`) are **kept** — only the `:root` block is removed
- Because `design-system.css` already defines `--bg-primary: #0E0E0E` as an alias, Home.redesigned.css technically works either way; the change in task 14 is for codebase consistency
- Visual regression and the RTL manual checklist (from the design doc) are out of scope for this automated plan and should be done manually after task 17

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "2.2", "2.3", "3.1"] },
    { "id": 2, "tasks": ["3.2"] },
    { "id": 3, "tasks": ["5.1", "6.1", "7.1", "8.1", "9.1", "10.1", "11.1", "12.1", "13.1", "14.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "6.2", "7.2", "7.3", "8.2", "9.2", "9.3"] },
    { "id": 5, "tasks": ["16.1", "16.2", "16.3", "16.4", "16.5"] }
  ]
}
```
