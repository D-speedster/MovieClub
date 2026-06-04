# Design Document — CSS Theme Rewrite

## Overview

هدف این بازنویسی، ایجاد یک لایه CSS یکدست و قابل نگهداری برای پروژه MovieClub است. پروژه یک سایت فارسی RTL با تم تاریک (Black & Gold) است. در حال حاضر سه مشکل اساسی وجود دارد:

1. **دو منبع `:root` متضاد**: `design-system.css` و `colors.css` هر دو متغیرهای رنگی تعریف می‌کنند اما مقادیر متفاوتی دارند (مثلاً `--bg-main: #0E0E0E` در مقابل `#121212`).
2. **رنگ‌های hardcode شده Netflix**: حدود ۳۰+ نمونه از `#e50914` و رنگ‌های آبی/بنفش در کامپوننت‌ها پراکنده است.
3. **متغیرهای تعریف‌نشده**: `--accent-primary`، `--bg-tertiary`، و `--accent-secondary` در چندین فایل استفاده می‌شوند اما در هیچ `:root` تعریف نشده‌اند.

---

## Architecture

### ساختار فایل‌ها و ترتیب بارگذاری

```
src/
├── styles/
│   └── design-system.css      ← Single Source of Truth (SSoT)
│                                 تنها فایلی که :root تعریف می‌کند
├── theme/
│   ├── colors.css             ← پس از merge: فقط utility classes باقی می‌ماند
│   │                            بدون هیچ :root block
│   └── global-theme.css       ← پس از cleanup: فقط html/body/#root با !important
└── components/
    └── **/*.css               ← فقط از توکن‌های design-system استفاده می‌کنند
```

### ترتیب import در entry point (index.css یا App.js)

```
1. design-system.css   ← اول: تعریف همه توکن‌ها
2. global-theme.css    ← دوم: اعمال تم پایه روی html/body
3. colors.css          ← سوم: utility classes (بدون :root)
4. component CSS files ← آخر: استایل‌های کامپوننت‌ها
```

---

## Components and Interfaces

### توکن‌های CSS (Token Map)

این جدول توکن‌های نهایی canonical در `:root` یکپارچه `design-system.css` را نشان می‌دهد. ستون «وضعیت» نشان می‌دهد که آیا توکن از قبل وجود دارد یا جدید اضافه می‌شود.

#### رنگ‌های پس‌زمینه

| توکن | مقدار | وضعیت | یادداشت |
|------|--------|--------|---------|
| `--bg-main` | `#0E0E0E` | موجود (design-system) | مقدار colors.css (`#121212`) حذف می‌شود |
| `--bg-primary` | `#0E0E0E` | موجود (alias) | برای سازگاری با کدهای موجود (Home.redesigned.css) |
| `--bg-secondary` | `#121212` | موجود | |
| `--bg-surface` | `#1A1A1A` | موجود | |
| `--bg-hover` | `#222222` | موجود | |

#### رنگ‌های متن

| توکن | مقدار | وضعیت | یادداشت |
|------|--------|--------|---------|
| `--text-primary` | `#FFFFFF` | موجود (design-system) | مقدار colors.css (`#E0E0E0`) **اشتباه** است |
| `--text-secondary` | `#E0E0E0` | موجود | مطابق منبع حقیقت تم |
| `--text-tertiary` | `#B5B5B5` | موجود | |
| `--text-muted` | `#8A8A8A` | موجود | |

#### رنگ‌های طلایی

| توکن | مقدار | وضعیت | یادداشت |
|------|--------|--------|---------|
| `--gold-primary` | `#C9A24D` | موجود | رنگ اصلی accent — جایگزین همه `--accent-primary` |
| `--gold-soft` | `#D6B66A` | موجود | جایگزین `--accent-secondary` |
| `--gold-muted` | `#B8954A` | موجود | |

#### رنگ‌های CTA

| توکن | مقدار | وضعیت | یادداشت |
|------|--------|--------|---------|
| `--cta-primary` | `#C9A24D` | **جدید** | جایگزین `#B84A2B` در colors.css و `#e50914` در کامپوننت‌ها |
| `--cta-hover` | `#D6B66A` | **جدید** | جایگزین `--gold-soft` برای hover state |
| `--cta-text` | `#0E0E0E` | **جدید** | رنگ متن روی دکمه CTA طلایی (پس‌زمینه تاریک) |

#### بوردرها

| توکن | مقدار | وضعیت | یادداشت |
|------|--------|--------|---------|
| `--border-default` | `#2A2A2A` | موجود | |
| `--border-primary` | `#2A2A2A` | موجود | alias برای سازگاری |
| `--border-secondary` | `#333333` | موجود | |
| `--border-focus` | `#C9A24D` | موجود | |

#### سایه‌ها و Overlay

همه توکن‌های `--shadow-*` و `--overlay-*` از قبل در design-system.css موجود هستند و تغییر نمی‌کنند.

#### توکن‌های **حذف‌شده** (undefined → اکنون تعریف‌شده)

این توکن‌ها در کامپوننت‌ها استفاده می‌شدند اما هرگز تعریف نشده بودند. به جای تعریف آن‌ها، **تمام ارجاعات به آن‌ها حذف یا جایگزین می‌شوند**:

| توکن قدیمی | جایگزین |
|------------|---------|
| `--accent-primary` | `var(--gold-primary)` |
| `--accent-secondary` | `var(--gold-soft)` |
| `--bg-tertiary` | `var(--bg-surface)` |
| `--bg-primary` (از colors.css) | `var(--bg-main)` |

---

## Data Models

### استراتژی merge کردن colors.css

**وضعیت فعلی**: `colors.css` یک بلوک `:root` مستقل دارد که با `design-system.css` تضاد دارد:

| متغیر | design-system.css | colors.css | Winner |
|-------|------------------|------------|--------|
| `--bg-main` | `#0E0E0E` | `#121212` | design-system ✓ |
| `--text-primary` | `#FFFFFF` | `#E0E0E0` | design-system ✓ |
| `--cta-primary` | *(تعریف‌نشده)* | `#B84A2B` | → مقدار جدید `#C9A24D` |
| `--gold-primary` | `#C9A24D` | `#C9A24D` | یکسان ✓ |

**اقدام**:
1. بلوک `:root { ... }` از `colors.css` **کاملاً حذف** می‌شود.
2. توکن‌های جدید (`--cta-primary`, `--cta-hover`, `--cta-text`) به design-system.css اضافه می‌شوند.
3. Utility classes موجود در colors.css (`.bg-main`, `.text-gold`, `.btn-cta` و غیره) **نگه داشته می‌شوند** اما مقادیر `rgba()` hardcode شده در `.input:focus` به `var(--border-focus)` تبدیل می‌شوند.

### پلان cleanup فایل global-theme.css

**اصل**: `!important` فقط برای override کردن browser defaults روی `html` و `body` مجاز است. هیچ کامپوننتی نباید از طریق global-theme override شود.

#### بلوک‌های **حذف‌شده** از global-theme.css:

| بلوک | دلیل حذف |
|------|-----------|
| `.row, .col, .col-1 ... .col-xl { color: inherit !important }` | Bootstrap grid classes نباید override شوند |
| `span, div, p, h1-h6, li, td, th { color: inherit !important }` | همه تگ‌های HTML را می‌پوشاند؛ cascade را می‌شکند |
| `button:not(.btn-cta), .btn:not(.btn-cta), a:not(...) { color: var(--gold-primary) !important }` | رنگ طلایی اجباری به همه دکمه‌ها |
| `div[style*="background-color: #fff"] { ... !important }` | override inline styles با !important |
| `div[style*="background-color: #000"] { ... !important }` | override inline styles با !important |
| `[style*="color: #fff"] { color: var(--text-primary) !important }` | override inline styles |
| `[style*="color: #000"] { color: var(--text-primary) !important }` | override inline styles |
| `.sidebar { border-right: ... !important }` | physical property در RTL context |
| تمام rule blocks برای `.movie-item, .movie-card, .film-item` | کامپوننت‌های خاص نباید از global-theme override شوند |
| `.navigation, .nav-menu, .menu` | دیتو |
| `.search-box, .search-input, .search-form` | دیتو |
| `.footer, .site-footer` | دیتو |
| `.modal, .popup, .dialog` | دیتو |
| `.dropdown, .dropdown-menu` | دیتو |
| `.table, table, .table th, .table td` | دیتو |
| `.pagination` | دیتو |
| `.tabs, .tab-menu` | دیتو |

#### بلوک‌های **نگه‌داشته‌شده** (بدون `!important` در غیر از html/body):

```css
/* پس از cleanup — ساختار نهایی global-theme.css */

/* 1. Base theme on html/body — !important مجاز */
html,
body {
    background-color: var(--bg-main) !important;
    color: var(--text-primary) !important;
    font-family: var(--font-primary) !important;
    direction: rtl !important;
    text-align: right !important;
}

/* 2. Root container — !important مجاز */
#root,
.App {
    background-color: var(--bg-main) !important;
    color: var(--text-primary) !important;
}

/* 3. Form elements — بدون !important، cascade طبیعی */
.form-control,
input:not([type="checkbox"]):not([type="radio"]),
textarea,
select {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-default);
    color: var(--text-primary);
}

.form-control:focus,
input:not([type="checkbox"]):not([type="radio"]):focus,
textarea:focus,
select:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 2px rgba(201, 162, 77, 0.2);
    outline: none;
}
```

---

## Per-File Change Table

### `src/theme/colors.css`

| تغییر | جزئیات |
|-------|---------|
| حذف | بلوک `:root { ... }` کاملاً حذف می‌شود |
| نگه‌داشته | utility classes: `.bg-main`, `.bg-surface`, `.text-gold`, `.btn-cta`, `.card`, `.input` |
| اصلاح | در `.input:focus`: `rgba(201, 162, 77, 0.2)` → `rgba(201, 162, 77, 0.2)` (قابل قبول چون مستقیماً از مقدار توکن نیست) |

---

### `src/components/Layout/Header/Header.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Undefined var | `var(--accent-primary)` در `.header__nav-link:hover svg` | `var(--gold-primary)` |
| Undefined var | `var(--accent-primary)` در `.header__mobile-nav-link:hover svg` | `var(--gold-primary)` |
| Undefined var | `var(--accent-primary)` در `.header__search-button { background }` | `var(--gold-primary)` |
| Undefined var | `var(--accent-primary)` در `.header__search-button:hover { background }` | `var(--gold-muted)` |
| Undefined var | `var(--bg-tertiary)` در `.header__search-input` | `var(--bg-surface)` |
| Undefined var | `var(--bg-tertiary)` در `.header__mobile-nav` | `var(--bg-surface)` |
| Undefined var | `var(--accent-secondary)` در `.search-result-item__rating` | `var(--gold-soft)` |
| Undefined var | `var(--accent-primary)` در `.search-results__spinner` | `var(--gold-primary)` |
| Undefined var | `var(--accent-primary)` در scrollbar thumb | `var(--gold-primary)` |
| Hardcoded color | `#B20710` در `.header__search-button:hover` | حذف (covered توسط `var(--gold-muted)`) |
| Hardcoded color | `#B20710` در scrollbar thumb hover | `var(--gold-muted)` |
| Hardcoded color | `rgba(229, 9, 20, 0.1)` در focus box-shadow | `rgba(201, 162, 77, 0.2)` |
| Undefined var در focus | `var(--accent-primary)` در `:focus` outline | `var(--gold-primary)` در `:focus-visible` |
| RTL: physical property | `right: var(--space-2)` در `.header__search-button` | `inset-inline-end: var(--space-2)` |
| RTL: physical property | `padding: ... var(--space-12) ... var(--space-4)` در input | `padding-inline-start: var(--space-4); padding-inline-end: var(--space-12)` |
| RTL: `[dir="rtl"]` override | `right: auto; left: var(--space-2)` | **حذف** (چون logical property استفاده می‌شود) |
| RTL: `[dir="rtl"]` override | `padding` override | **حذف** |
| Redundant | `font-style: normal` در nav-link | **حذف** |
| Redundant | `font-variant: normal` در nav-link | **حذف** |
| Redundant | `text-transform: none` در nav-link | **حذف** |
| Redundant | `background-color: rgba(0, 0, 0, 0)` در nav-link | **حذف** |

---

### `src/components/Layout/MobileNav/MobileNav.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Undefined var | `var(--accent-primary)` در `.mobile-nav__item--active .mobile-nav__icon` | `var(--gold-primary)` |
| Undefined var | `var(--accent-primary)` در `.mobile-nav__indicator` | `var(--gold-primary)` |
| Focus state | `var(--accent-primary)` در `:focus` | `var(--gold-primary)` در `:focus-visible` |
| Focus selector | `:focus` → `:focus-visible` | تغییر selector برای consistency |
| High contrast | `var(--accent-primary)` در high-contrast media | `var(--gold-primary)` |
| RTL | `left: 50%` در `.mobile-nav__indicator` | `inset-inline-start: 50%` (یا نگه داشتن چون centered است) |

---

### `src/components/UI/MovieCard/MovieCard.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Comment | `/* 🎬 NETFLIX-STYLE MOVIE CARD */` | `/* movie-card */` |
| Hardcoded background | `background-color: #1e293b` در کارت اصلی | `var(--bg-surface)` |
| Hardcoded skeleton | `#1e293b` و `#334155` در `.netflix-movie-card__poster-skeleton` | `var(--bg-surface)` و `var(--bg-hover)` |
| Hardcoded error bg | `background-color: #1e293b` در poster-error | `var(--bg-surface)` |
| Hardcoded error text | `color: #64748b` | `var(--text-muted)` |
| Hardcoded rating | `#FFC107` در rating badge (border و color) | `var(--gold-primary)` |
| Hardcoded title | `color: #f1f5f9` در `.netflix-movie-card__title` | `var(--text-primary)` |
| Hardcoded quality | `color: #f1f5f9` در `.netflix-movie-card__quality` | `var(--text-primary)` |
| Hardcoded year badge | `color: #f1f5f9` در `.netflix-movie-card__year-badge` | `var(--text-primary)` |
| Hardcoded play btn | `rgba(229,9,20,0.9)` و `#e50914` | `var(--cta-primary)` |
| Focus | `outline: 2px solid #e50914` | `outline: 2px solid var(--gold-primary)` |
| RTL badge | `left: 10px` در `.netflix-movie-card__year-badge` | `inset-inline-start: 10px` (حذف `[dir="rtl"]` override) |

---

### `src/components/UI/MovieSlider/MovieSlider.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Hardcoded title color | `color: #f1f5f9` در `.ms-title` | `var(--text-primary)` |
| Hardcoded underline | `background: #e50914` در `.ms-title::after` | `var(--gold-primary)` |
| Hardcoded viewall | `color: #94a3b8` | `var(--text-tertiary)` |
| Hardcoded viewall hover | `border-color: #e50914`, `background: rgba(229,9,20,0.08)` | `var(--gold-primary)`, `rgba(201,162,77,0.08)` |
| Hardcoded nav bg | `background: rgba(15, 23, 42, 0.85)` در `.ms-nav` | `rgba(14, 14, 14, 0.85)` یا `var(--overlay-heavy)` |
| Hardcoded nav color | `color: #cbd5e1` در `.ms-nav` | `var(--text-tertiary)` |
| Hardcoded nav hover | `background: #e50914`, `border-color: #e50914` | `var(--gold-primary)` |
| Hardcoded skeleton | `#1e293b` و `#334155` در title/viewall/card skeletons | `var(--bg-surface)` و `var(--bg-hover)` |
| RTL nav buttons | `right: 0` (prev) و `left: 0` (next) | `inset-inline-start: 0` (prev) و `inset-inline-end: 0` (next) |

---

### `src/components/UI/HeroSection/HeroSection.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Hardcoded logo accent | `color: #e50914` در `.hero-header__logo-accent` | `var(--gold-primary)` |
| Hardcoded font | `font-family: 'Segoe UI', Arial, sans-serif` در logo | `var(--font-primary)` |
| Hardcoded subscribe btn | `background: #e50914` و `#c40812` | `var(--cta-primary)` و `var(--cta-hover)` |
| Hardcoded feature icon | `color: #e50914` در `.hero-feature svg` | `var(--gold-primary)` |
| Hardcoded CTA button | `background: #e50914`, `#c40812`, `box-shadow rgba(229,9,20,...)` | `var(--cta-primary)`, `var(--cta-hover)`, gold shadow |
| Hardcoded drawer bg | `background: #0f172a` در `.hero-drawer` | `var(--bg-surface)` |
| Hardcoded drawer logo | `color: #e50914` در `.hero-drawer__logo-accent` | `var(--gold-primary)` |
| Hardcoded font | `font-family: 'Segoe UI', Arial, sans-serif` در drawer | `var(--font-primary)` |
| Hardcoded subscribe | `background: #e50914`, `#c40812` در drawer | `var(--cta-primary)`, `var(--cta-hover)` |
| Hardcoded skeleton | `background: #0a0a0a` در `.hero-section--loading` | `var(--bg-main)` |
| Hardcoded skeleton | `#1e293b` و `#334155` در shimmer | `var(--bg-surface)` و `var(--bg-hover)` |
| RTL: physical border | `border-right: 3px solid transparent` در `.hero-drawer__link` | `border-inline-end: 3px solid transparent` |
| RTL: physical border | `border-right-color: #e50914` در hover | `border-inline-end-color: var(--gold-primary)` |
| RTL: padding | `padding-right: 28px` در hover | `padding-inline-end: 28px` |
| Focus | `outline: 2px solid #e50914` در `:focus-visible` | `outline: 2px solid var(--gold-primary)` |

---

### `src/components/UI/SearchOverlay/SearchOverlay.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Hardcoded box bg | `background: #1a1a2e` در `.search-overlay__box` | `var(--bg-surface)` |
| Hardcoded icon | `color: #888` در `.search-overlay__icon` | `var(--text-muted)` |
| Hardcoded close | `color: #888` در `.search-overlay__close` | `var(--text-muted)` |
| Hardcoded status | `color: #888` در `.search-overlay__status` | `var(--text-muted)` |
| Hardcoded meta | `color: #888` در `.search-overlay__meta` | `var(--text-muted)` |
| Hardcoded input | `color: #fff` در `.search-overlay__input` | `var(--text-primary)` |
| Hardcoded title | `color: #fff` در `.search-overlay__title` | `var(--text-primary)` |
| Hardcoded placeholder | `color: #666` | `var(--text-muted)` |
| Hardcoded poster bg | `background: #2a2a4a` | `var(--bg-hover)` |

---

### `src/components/Layout/Footer/Footer.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Hardcoded background | `background: #0a0a0a` | `var(--bg-main)` |
| Hardcoded font | `font-family: 'Segoe UI', Arial, sans-serif` در logo | `var(--font-primary)` |
| Hardcoded logo accent | `color: #e50914` در `.site-footer__logo-accent` | `var(--gold-primary)` |
| Hardcoded nav link | `color: #9ca3af` | `var(--text-tertiary)` |
| Hardcoded social btn | `color: #9ca3af` | `var(--text-tertiary)` |
| Hardcoded social hover | `background: #e50914` | `var(--gold-primary)` |
| Hardcoded copy | `color: #6b7280` | `var(--text-muted)` |
| Hardcoded status | `color: #6b7280` | `var(--text-muted)` |

---

### `src/Pages/Movies/Movies.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Hardcoded hero gradient | `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)` | `linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-hover) 100%)` |
| Hardcoded hero background | `linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #d2691e 100%)` | `linear-gradient(to bottom, var(--bg-main) 0%, var(--bg-surface) 100%)` |
| Hardcoded hero text | `color: #f1f5f9` | `var(--text-primary)` |
| Undefined var | `var(--accent-primary)` در `.btn-retry` | `var(--gold-primary)` |
| Hardcoded hover | `background-color: #B20710` در `.btn-retry:hover` | `var(--cta-hover)` |
| Hardcoded shadow | `rgba(229, 9, 20, 0.3)` در `.btn-retry:hover` | `rgba(201, 162, 77, 0.3)` |

---

### `src/Pages/Series/Series.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Hardcoded hero gradient | `linear-gradient(135deg, #2d1b69 0%, #11998e 50%, #38ef7d 100%)` | `linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-hover) 100%)` |
| Hardcoded background | `linear-gradient(135deg, #1b2951 0%, #2980b9 50%, #3498db 100%)` | `linear-gradient(to bottom, var(--bg-main) 0%, var(--bg-surface) 100%)` |
| Hardcoded hero text | `color: #f1f5f9` | `var(--text-primary)` |
| Undefined var | `var(--accent-primary)` در `.btn-retry` | `var(--gold-primary)` |
| Hardcoded hover | `background-color: #B20710` در `.btn-retry:hover` | `var(--cta-hover)` |
| Hardcoded shadow | `rgba(229, 9, 20, 0.3)` در `.btn-retry:hover` | `rgba(201, 162, 77, 0.3)` |

---

### `src/Pages/Home/Home.redesigned.css`

| مشکل | مقدار فعلی | مقدار جدید |
|------|------------|------------|
| Mismatched var | `var(--bg-primary)` در `.home-page` | `var(--bg-main)` (توکن‌های design-system یکپارچه می‌شوند لذا `--bg-primary` = `--bg-main` = `#0E0E0E` — این تغییر اختیاری است) |

> **یادداشت**: از آنجا که design-system.css هر دو `--bg-main` و `--bg-primary` را با مقدار یکسان `#0E0E0E` تعریف می‌کند، این فایل از نظر عملکردی درست کار می‌کند. اما برای consistency با بقیه کدبیس، تبدیل به `var(--bg-main)` توصیه می‌شود.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

---

### پیش‌نیاز: آیا Property-Based Testing مناسب است؟

این feature شامل **بازنویسی CSS** است — یعنی فایل‌های استاتیک text که توسط browser parse می‌شوند. PBT در معنای کلاسیک (تولید random input برای تست توابع) اینجا مستقیماً اعمال نمی‌شود. با این حال، می‌توان آن را با رویکرد متفاوتی اعمال کرد:

- **مجموعه فایل‌های CSS در scope** → مثل یک collection از input objects است
- **قوانین (invariants)** → هر فایل باید خصوصیات معینی داشته باشد
- با یک test runner می‌توان برای **هر فایل در scope** یک assertion اجرا کرد

این رویکرد با PBT libraries مثل `fast-check` (TypeScript/JavaScript) پشتیبانی می‌شود: آرایه‌ای از مسیر فایل‌ها به عنوان "generator" عمل می‌کند و assertions روی محتوای هر فایل اعمال می‌شود.

---

### Property 1: No Netflix Red in Component CSS

*For any* CSS file in the component scope (MovieCard, MovieSlider, HeroSection, Header, MobileNav, Footer, SearchOverlay, MoviesPage, SeriesPage, HomePage), that file SHALL NOT contain the hex values `#e50914`, `#c40812`, `#B20710`, or `#b20710` as color values.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 6.1, 6.2**

---

### Property 2: No Undefined CSS Variable References

*For any* CSS file in the component scope, that file SHALL NOT contain references to `var(--accent-primary)`, `var(--bg-tertiary)`, or `var(--accent-secondary)`.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.6**

---

### Property 3: No Hardcoded Non-Theme Hex Colors

*For any* CSS file in the component scope, that file SHALL NOT contain hardcoded hex or raw RGB values from the forbidden palette: `#1e293b`, `#334155`, `#64748b`, `#f1f5f9`, `#94a3b8`, `#cbd5e1`, `#FFC107`, `#ffc107`, `#1a1a2e`, `#0a0a0a`, `#9ca3af`, `#6b7280`, `#1b2951`, `#2980b9`, `#2d1b69`, `#1a1a2e`, `#16213e`, `#0f3460`.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 8.1, 8.2, 8.3**

---

### Property 4: Focus States Use Gold Token

*For any* CSS file in the component scope, for any `:focus` or `:focus-visible` rule block, any `outline` property in that block SHALL use `var(--gold-primary)` and SHALL NOT contain a hardcoded color value.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

---

### Property 5: Skeleton Animations Use Theme Tokens

*For any* CSS file in the component scope that contains a `linear-gradient` inside a `@keyframes` or skeleton class, the gradient colors SHALL use `var(--bg-surface)` and `var(--bg-hover)` and SHALL NOT use hardcoded hex values `#1e293b` or `#334155`.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

---

### Property 6: No !important Outside html/body/#root in global-theme.css

*For any* CSS rule block in `global-theme.css` whose selector does NOT match `html`, `body`, `#root`, or `.App`, that block SHALL NOT contain any declaration with `!important`.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

---

### Property 7: Layout Components Use Logical CSS Properties

*For any* CSS file in the layout component scope (Header, MobileNav, HeroSection, Footer, MovieSlider), that file SHALL NOT use `right:` or `left:` as a positioning property (in `position: absolute/fixed/relative` context) for RTL-sensitive elements. Instead, `inset-inline-start` and `inset-inline-end` SHALL be used.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.7**

---

## Error Handling

### مدیریت مقادیر fallback در CSS Variables

هر جا از `var()` استفاده می‌شود، browser یک silent fallback به `initial value` انجام می‌دهد اگر متغیر تعریف‌نشده باشد. این باعث می‌شود باگ‌ها نامرئی بمانند. راه‌حل:

1. **تعریف همه توکن‌ها در design-system.css** — هیچ ارجاعی به توکن تعریف‌نشده نباشد
2. **Fallback values برای مهم‌ترین توکن‌ها**: در موارد حساس می‌توان از `var(--token, #fallback)` استفاده کرد:
   ```css
   /* مثال برای توکن‌های اصلی */
   background-color: var(--bg-main, #0E0E0E);
   color: var(--text-primary, #FFFFFF);
   ```
3. **grep-based CI check** — یک script ساده در pipeline که ارجاعات به `--accent-primary`، `--bg-tertiary`، و `--accent-secondary` را پیدا می‌کند

---

## Testing Strategy

### رویکرد کلی: Dual Testing

| نوع تست | هدف |
|---------|-----|
| Unit/Example tests | تأیید مقادیر خاص توکن‌ها در design-system.css |
| Property tests | تأیید invariants روی همه فایل‌های CSS در scope |
| Visual regression | تأیید ظاهر در browser (RTL و LTR) |
| Manual RTL checklist | بررسی دستی چیدمان در مرورگر با `dir="rtl"` |

---

### Property-Based Tests (با `fast-check` در TypeScript)

**کتابخانه**: [`fast-check`](https://fast-check.dev/) — PBT library برای TypeScript/JavaScript

**پیکربندی**: حداقل ۱۰۰ iteration برای هر property test

**ساختار test file**: `src/__tests__/css-theme.property.test.ts`

```typescript
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

// آرایه فایل‌های در scope — "generator" ما
const CSS_FILES_IN_SCOPE = [
  'src/components/Layout/Header/Header.css',
  'src/components/Layout/MobileNav/MobileNav.css',
  'src/components/Layout/Footer/Footer.css',
  'src/components/UI/MovieCard/MovieCard.css',
  'src/components/UI/MovieSlider/MovieSlider.css',
  'src/components/UI/HeroSection/HeroSection.css',
  'src/components/UI/SearchOverlay/SearchOverlay.css',
  'src/Pages/Movies/Movies.css',
  'src/Pages/Series/Series.css',
  'src/Pages/Home/Home.redesigned.css',
];

// Feature: css-theme-rewrite, Property 1: No Netflix Red
it('No Netflix red in any component CSS file', () => {
  fc.assert(
    fc.property(fc.constantFrom(...CSS_FILES_IN_SCOPE), (filePath) => {
      const content = fs.readFileSync(path.resolve(filePath), 'utf8');
      const NETFLIX_RED = /#e50914|#c40812|#B20710|#b20710/gi;
      return !NETFLIX_RED.test(content);
    }),
    { numRuns: CSS_FILES_IN_SCOPE.length }
  );
});

// Feature: css-theme-rewrite, Property 2: No undefined variable references
it('No undefined CSS variable references in component CSS files', () => {
  fc.assert(
    fc.property(fc.constantFrom(...CSS_FILES_IN_SCOPE), (filePath) => {
      const content = fs.readFileSync(path.resolve(filePath), 'utf8');
      const UNDEFINED_VARS = /var\(--accent-primary\)|var\(--bg-tertiary\)|var\(--accent-secondary\)/g;
      return !UNDEFINED_VARS.test(content);
    }),
    { numRuns: CSS_FILES_IN_SCOPE.length }
  );
});

// Feature: css-theme-rewrite, Property 4: Focus states use gold token
it('All focus/focus-visible blocks use var(--gold-primary) for outline', () => {
  fc.assert(
    fc.property(fc.constantFrom(...CSS_FILES_IN_SCOPE), (filePath) => {
      const content = fs.readFileSync(path.resolve(filePath), 'utf8');
      // استخراج محتوای بلوک‌های :focus و :focus-visible
      const focusBlocks = content.match(/:(focus|focus-visible)\s*\{[^}]+\}/g) || [];
      return focusBlocks.every(block => {
        if (!block.includes('outline')) return true;
        // outline باید از var(--gold-primary) استفاده کند
        return /outline:\s*\d+px\s+solid\s+var\(--gold-primary\)/.test(block);
      });
    }),
    { numRuns: CSS_FILES_IN_SCOPE.length }
  );
});

// Feature: css-theme-rewrite, Property 5: Skeleton animations use theme tokens
it('Skeleton gradients use only theme tokens', () => {
  fc.assert(
    fc.property(fc.constantFrom(...CSS_FILES_IN_SCOPE), (filePath) => {
      const content = fs.readFileSync(path.resolve(filePath), 'utf8');
      // اگر شامل skeleton/shimmer است، نباید رنگ hardcode داشته باشد
      if (!content.includes('shimmer') && !content.includes('skeleton')) return true;
      return !/#1e293b|#334155/gi.test(content);
    }),
    { numRuns: CSS_FILES_IN_SCOPE.length }
  );
});
```

**Tag format برای هر test**:
```
Feature: css-theme-rewrite, Property {number}: {property_text}
```

---

### Example-Based Unit Tests

```typescript
// src/__tests__/css-tokens.test.ts
describe('design-system.css token correctness', () => {
  let content: string;
  
  beforeAll(() => {
    content = fs.readFileSync('src/styles/design-system.css', 'utf8');
  });

  it('defines --bg-primary as #0E0E0E', () => {
    expect(content).toMatch(/--bg-primary:\s*#0E0E0E/i);
  });

  it('defines --text-secondary as #E0E0E0', () => {
    expect(content).toMatch(/--text-secondary:\s*#E0E0E0/i);
  });

  it('defines --cta-primary as gold, not Netflix red', () => {
    expect(content).toMatch(/--cta-primary:\s*#C9A24D/i);
    expect(content).not.toMatch(/--cta-primary:\s*#e50914/i);
  });

  it('colors.css has no :root block', () => {
    const colorsContent = fs.readFileSync('src/theme/colors.css', 'utf8');
    expect(colorsContent).not.toMatch(/:root\s*\{/);
  });
});
```

---

### Grep-based CI Checks (script)

این script در CI pipeline اجرا می‌شود تا از regression جلوگیری شود:

```bash
#!/bin/bash
# scripts/check-css-theme.sh

FAILED=0

# بررسی Netflix Red
if grep -r --include="*.css" -l '#e50914\|#c40812\|#B20710' src/components src/Pages; then
  echo "❌ Netflix red colors found in component CSS"
  FAILED=1
fi

# بررسی متغیرهای تعریف‌نشده
if grep -r --include="*.css" -l 'var(--accent-primary)\|var(--bg-tertiary)\|var(--accent-secondary)' src/; then
  echo "❌ Undefined CSS variables found"
  FAILED=1
fi

# بررسی :root مجزا در colors.css
if grep -l ':root' src/theme/colors.css; then
  echo "❌ colors.css still has a :root block"
  FAILED=1
fi

# بررسی !important خارج از html/body/#root
if grep -v 'html\|body\|#root\|.App' src/theme/global-theme.css | grep '!important'; then
  echo "❌ !important found outside html/body/#root in global-theme.css"
  FAILED=1
fi

exit $FAILED
```

---

### Visual Regression Testing

**ابزار پیشنهادی**: [Chromatic](https://www.chromatic.com/) (با Storybook) یا [Playwright](https://playwright.dev/) screenshot tests

**موارد اساسی برای snapshot**:
1. `Header` در حالت normal و scrolled
2. `MovieCard` در حالت loading (skeleton) و loaded
3. `HeroSection` CTA buttons
4. `Footer` با social buttons
5. `MobileNav` با active state

---

### RTL Testing Checklist (Manual)

تست دستی در Chrome با `document.documentElement.setAttribute('dir', 'rtl')`:

- [ ] دکمه جستجو در Header در سمت **چپ** قرار دارد (برای RTL = inline-end)
- [ ] خط زیر عنوان MovieSlider در سمت **راست** است
- [ ] دکمه‌های prev/next در MovieSlider به درستی جابجا شده‌اند
- [ ] Drawer در HeroSection از سمت **راست** slide می‌کند
- [ ] نشانگر drawer link (خط عمودی) در سمت **راست** لینک است
- [ ] Badge سال در MovieCard در گوشه **راست-بالا** است
- [ ] MobileNav indicator در بالای آیتم centered است
