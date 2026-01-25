# 🎭 Mock API Service

این پوشه شامل سرویس Mock API برای جایگزینی دیتابیس خارجی است.

## فایل‌ها

### `mockApi.js`
- سرویس اصلی Mock API
- شامل تمام متدهای دریافت داده
- شبیه‌سازی تاخیر شبکه

### `mockApiAdapter.js`
- Adapter برای سازگاری با axios
- شبیه‌سازی ساختار response
- پشتیبانی از endpoint های مختلف

### `testMockApi.js`
- فایل تست برای Mock API
- تست خودکار در محیط development
- اعتبارسنجی عملکرد

## استفاده سریع

```javascript
import mockApiService from './mockApi';

// دریافت فیلم‌ها
const movies = await mockApiService.getMoviez();

// جستجو
const results = await mockApiService.search('batman');

// فیلتر ژانر
const actionMovies = await mockApiService.getMoviesByGenre('اکشن');
```

## تنظیمات

```javascript
// در mockApi.js
this.delay = 500; // تاخیر شبیه‌سازی (ms)
```

## داده‌ها

داده‌ها از فایل `src/data/db.json` خوانده می‌شود که شامل:
- `Moviez`: آرایه فیلم‌ها
- `Series`: آرایه سریال‌ها

## API Endpoints

- `GET /Moviez` → `getMoviez()`
- `GET /Series` → `getSeries()`
- `GET /BoxOffice` → `getBoxOffice()`
- `GET /Movie/:id` → `getMovieById(id)`
- `GET /Series/:id` → `getSeriesById(id)`