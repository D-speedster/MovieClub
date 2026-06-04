# Requirements Document

## Introduction

بازنویسی کامل لایه CSS پروژه MovieClub؛ یک سایت فارسی دانلود فیلم و سریال با جهت‌نویسی RTL، تم تاریک، و استک React + CSS Modules.

هدف: ایجاد یک سیستم طراحی یکدست بر پایه تم سیاه + طلایی، حذف کامل رنگ‌های Netflix (قرمز)، رفع تمام متغیرهای CSS تعریف‌نشده، یکپارچه‌سازی فایل‌های تم، و پشتیبانی کامل RTL در همه کامپوننت‌ها.

---

## Glossary

- **Design_System**: فایل `src/styles/design-system.css` که تعاریف متغیرهای CSS سراسری را نگه می‌دارد
- **Colors_File**: فایل `src/theme/colors.css` که متغیرهای رنگی را تعریف می‌کند
- **Global_Theme**: فایل `src/theme/global-theme.css` که تم پایه سراسری را اعمال می‌کند
- **Header**: کامپوننت `src/components/Layout/Header/Header.css`
- **Footer**: کامپوننت `src/components/Layout/Footer/Footer.css`
- **MobileNav**: کامپوننت `src/components/Layout/MobileNav/MobileNav.css`
- **MovieCard**: کامپوننت `src/components/UI/MovieCard/MovieCard.css`
- **MovieSlider**: کامپوننت `src/components/UI/MovieSlider/MovieSlider.css`
- **HeroSection**: کامپوننت `src/components/UI/HeroSection/HeroSection.css`
- **SearchOverlay**: کامپوننت `src/components/UI/SearchOverlay/SearchOverlay.css`
- **MoviesPage**: فایل `src/Pages/Movies/Movies.css`
- **SeriesPage**: فایل `src/Pages/Series/Series.css`
- **HomePage**: فایل `src/Pages/Home/Home.redesigned.css`
- **Token**: متغیر CSS تعریف‌شده در `:root` (مانند `var(--gold-primary)`)
- **Hardcoded_Color**: مقدار رنگ مستقیم به صورت hex، rgb، یا rgba بدون استفاده از Token
- **Netflix_Red**: مقادیر `#e50914`، `#c40812`، `#B20710` که از تم Netflix هستند
- **Undefined_Variable**: متغیر CSS که در هیچ `:root` تعریف نشده (مانند `--accent-primary`، `--bg-tertiary`، `--accent-secondary`)
- **Logical_Property**: property‌های CSS مستقل از جهت مانند `margin-inline-start`، `padding-inline-end`، `inset-inline-start`
- **CTA_Color**: رنگ دکمه فراخوان به اقدام — در design-system جدید: `var(--gold-primary)`

---

## Requirements

### Requirement 1: Single Source of Truth for CSS Variables

**User Story:** As a developer, I want all CSS variables defined in a single `:root` source of truth, so that there are no undefined variables or conflicts between files.

#### Acceptance Criteria

1. THE Design_System SHALL تمام متغیرهای رنگ، فاصله، شعاع کناره، سایه، انتقال، و z-index را دقیقاً بر اساس منبع حقیقت تم در یک بلوک `:root` واحد تعریف کند
2. THE Colors_File SHALL محتوای آن کاملاً با Design_System ادغام شود به طوری که هیچ تعریف `:root` مجزایی در Colors_File باقی نماند
3. THE Design_System SHALL متغیر `--bg-primary` را به مقدار `#0E0E0E` تعریف کند تا با کدهای موجود سازگار باشد
4. THE Design_System SHALL متغیر `--text-secondary` را با مقدار `#E0E0E0` و `--text-tertiary` را با مقدار `#B5B5B5` تعریف کند — مطابق منبع حقیقت تم
5. IF متغیر `--cta-primary` در کدهای موجود استفاده شده باشد، THEN THE Design_System SHALL آن را با مقدار `#C9A24D` تعریف کند تا Netflix_Red جایگزین شود
6. THE Design_System SHALL متغیر `--border-primary` را به مقدار `#2A2A2A` و `--border-secondary` را به مقدار `#333333` تعریف کند

---

### Requirement 2: No Hardcoded Colors in Components

**User Story:** As a designer, I want no hardcoded hex or rgba color values in component CSS files, so that changing the theme in the future requires only one-point edits.

#### Acceptance Criteria

1. THE MovieCard SHALL هیچ Hardcoded_Color از جمله `#FFC107`، `#e50914`، `#1e293b`، `#334155`، `#64748b`، `#f1f5f9` نداشته باشد و رتبه‌بندی از `var(--gold-primary)` و skeleton از `var(--bg-surface)` و `var(--bg-hover)` استفاده کند
2. THE MovieSlider SHALL هیچ Hardcoded_Color از جمله `#e50914`، `#94a3b8`، `#cbd5e1`، `#1e293b`، `#334155` نداشته باشد
3. THE HeroSection SHALL هیچ Hardcoded_Color از جمله `#e50914`، `#c40812`، `#cbd5e1`، `#94a3b8`، `#0f172a` نداشته باشد و دکمه CTA از `var(--gold-primary)` استفاده کند
4. THE Footer SHALL هیچ Hardcoded_Color از جمله `#e50914`، `#9ca3af`، `#6b7280`، `#0a0a0a` نداشته باشد
5. THE SearchOverlay SHALL رنگ پس‌زمینه `#1a1a2e` را به `var(--bg-surface)` و `#888` را به `var(--text-muted)` تبدیل کند
6. THE MoviesPage SHALL gradientهای آبی/قهوه‌ای هاردکد hero را به پس‌زمینه بر اساس Tokenها جایگزین کند
7. THE SeriesPage SHALL gradientهای بنفش/سبز هاردکد hero را به پس‌زمینه بر اساس Tokenها جایگزین کند
8. WHEN هر فایل CSS در scope بررسی شود، THE فایل مذکور SHALL هیچ مقدار رنگ hex یا rgba برای رنگ‌های تم نداشته باشد

---

### Requirement 3: No Undefined CSS Variable References

**User Story:** As a developer, I want no CSS `var()` references to undefined variables, so that the browser does not silently fall back to nothing and the UI appearance is predictable.

#### Acceptance Criteria

1. THE Header SHALL هیچ ارجاعی به `var(--accent-primary)`، `var(--bg-tertiary)`، یا `var(--accent-secondary)` نداشته باشد و به جای آن‌ها از `var(--gold-primary)`، `var(--bg-surface)`، و `var(--gold-soft)` استفاده کند
2. THE MobileNav SHALL هیچ ارجاعی به `var(--accent-primary)` نداشته باشد و به جای آن از `var(--gold-primary)` استفاده کند
3. THE MoviesPage SHALL هیچ ارجاعی به `var(--accent-primary)` نداشته باشد و دکمه retry از `var(--gold-primary)` استفاده کند
4. THE SeriesPage SHALL هیچ ارجاعی به `var(--accent-primary)` نداشته باشد و دکمه retry از `var(--gold-primary)` استفاده کند
5. THE HomePage SHALL هیچ ارجاعی به `var(--bg-primary)` از Colors_File ناهماهنگ نداشته باشد و به جای آن از `var(--bg-main)` استفاده کند
6. WHEN تمام فایل‌های CSS در scope بررسی شوند، THE هر فایل SHALL تنها از متغیرهایی استفاده کند که در Design_System تعریف شده‌اند

---

### Requirement 4: Minimal Global Theme Overrides

**User Story:** As a developer, I want Global_Theme to use `!important` only on `html`, `body`, and `#root`, so that component-specific styles are not overridden globally.

#### Acceptance Criteria

1. THE Global_Theme SHALL استفاده از `!important` را فقط به selectorهای `html`، `body`، و `#root` محدود کند
2. THE Global_Theme SHALL بلوک `button:not(.btn-cta), .btn:not(.btn-cta), a:not(...)` که رنگ طلایی اجباری به همه دکمه‌ها اعمال می‌کند را حذف کند
3. THE Global_Theme SHALL selectorهای عمومی `span, div, p, h1, h2, h3, h4, h5, h6, li, td, th` با `color: inherit !important` را حذف کند
4. THE Global_Theme SHALL selectorهای override رنگ inline-style مانند `div[style*="background-color: #fff"]` را حذف کند
5. WHILE Global_Theme فعال است، THE سیستم SHALL پایه تم تاریک را روی `html` و `body` اعمال کند بدون اینکه cascade طبیعی CSS را برای کامپوننت‌ها مختل کند

---

### Requirement 5: Complete RTL Support with Logical Properties

**User Story:** As a Persian-language user, I want all layouts to display correctly in RTL mode, so that the right-to-left reading experience feels natural.

#### Acceptance Criteria

1. THE Header SHALL به جای `left`/`right` هاردکد برای موقعیت‌دهی دکمه جستجو از `inset-inline-end` و `inset-inline-start` استفاده کند
2. THE Header SHALL به جای `padding-left`/`padding-right` هاردکد در input جستجو از `padding-inline-start` و `padding-inline-end` استفاده کند
3. THE MovieSlider SHALL جهت دکمه‌های prev/next را برای RTL اصلاح کند: دکمه «قبلی» در `inset-inline-start: 0` و دکمه «بعدی» در `inset-inline-end: 0` قرار گیرد
4. THE HeroSection SHALL به جای `border-right` هاردکد در drawer link indicator از `border-inline-end` استفاده کند
5. THE Footer SHALL font-family هاردکد `'Segoe UI', Arial, sans-serif` را به `var(--font-primary)` تبدیل کند
6. THE HeroSection SHALL font-family هاردکد `'Segoe UI', Arial, sans-serif` را به `var(--font-primary)` تبدیل کند
7. WHEN یک عنصر در صفحه RTL یا LTR است، THE آن عنصر SHALL با Logical Properties در هر دو حالت چیدمان صحیح داشته باشد بدون نیاز به `[dir="rtl"]` override اضافی

---

### Requirement 6: Consistent Gold Focus States

**User Story:** As a keyboard user, I want all focus states to be shown with the gold theme color instead of Netflix red, so that the focus ring is consistent with the site's visual identity.

#### Acceptance Criteria

1. THE HeroSection SHALL تمام `outline: 2px solid #e50914` را در `:focus-visible` به `outline: 2px solid var(--gold-primary)` تبدیل کند
2. THE MovieCard SHALL `outline: 2px solid #e50914` را در `:focus-visible` به `outline: 2px solid var(--gold-primary)` تبدیل کند
3. THE Header SHALL `outline: 2px solid var(--accent-primary)` را در `:focus` به `outline: 2px solid var(--gold-primary)` در `:focus-visible` تبدیل کند
4. THE MobileNav SHALL از `:focus-visible` به جای `:focus` استفاده کند و رنگ outline را به `var(--gold-primary)` تبدیل کند
5. WHEN یک عنصر interactable focus می‌گیرد، THE آن عنصر SHALL outline با رنگ `var(--gold-primary)` نمایش دهد

---

### Requirement 7: Clean CSS Without Redundant Properties

**User Story:** As a developer, I want CSS files to be free of redundant and zero-value properties, so that the codebase is easier to read and maintain.

#### Acceptance Criteria

1. THE Header SHALL تمام `font-style: normal`، `font-variant: normal`، و `text-transform: none` را که مقدار پیش‌فرض مرورگر هستند حذف کند
2. THE Header SHALL تمام `background-color: rgba(0, 0, 0, 0)` را که معادل `transparent` است حذف کند
3. THE Global_Theme SHALL selectorهای `.row, .col, .col-1 ... .col-xl` با `color: inherit !important` را حذف کند
4. THE MovieCard SHALL comment `/* 🎬 NETFLIX-STYLE MOVIE CARD */` را به `/* movie-card */` تغییر دهد
5. WHEN هر فایل CSS در scope ذخیره می‌شود، THE فایل SHALL فقط declarations شامل شود که مقدار واقعی در مقابل مقدار پیش‌فرض مرورگر ارائه می‌دهند

---

### Requirement 8: Theme-Consistent Skeleton Animations

**User Story:** As a user, I want skeleton loading animations to use theme-consistent colors, so that the loading experience matches the rest of the interface.

#### Acceptance Criteria

1. THE MovieCard SHALL gradient skeleton با `#1e293b` و `#334155` را به `linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-hover) 50%, var(--bg-surface) 75%)` تبدیل کند
2. THE MovieSlider SHALL تمام gradientهای skeleton را از `#1e293b` و `#334155` به `var(--bg-surface)` و `var(--bg-hover)` تبدیل کند
3. THE HeroSection SHALL gradient skeleton را از `#1e293b` و `#334155` به `var(--bg-surface)` و `var(--bg-hover)` تبدیل کند
4. WHEN skeleton loading نمایش داده می‌شود، THE انیمیشن shimmer SHALL از رنگ‌های `var(--bg-surface)` و `var(--bg-hover)` استفاده کند تا با تم یکدست باشد
