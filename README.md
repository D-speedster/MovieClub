# MovieClub

## معرفی
MovieClub یک پلتفرم دانلود کامل فیلم و سریال فارسی است که به صورت **Full‑Stack** طراحی شده و برای ارائه یک تجربه کاربری حرفه‌ای و مقیاس‌پذیر ساخته شده است. این پروژه به عنوان پروژه نهایی دانشگاهی طراحی و پیاده‌سازی شده و شامل بخش‌های زیر است:

* **Frontend** – رابط کاربری مدرن با React 19، React Router v6، و Material‑UI برای پنل مدیریت.
* **Backend** – سرور Node.js/Express 5، Mongoose، MongoDB، JWT، و سایر کتابخانه‌های امنیتی.
* **Admin Panel** – مدیریت محتوا، کاربران، آمار، و بخش‌های ویژه با استفاده از MUI.

## ویژگی‌ها
* مرور و جستجوی فیلم، سریال و انیمه با فیلتر بر اساس ژانر، نوع و کیفیت.
* لینک‌های دانلود مستقیم برای هر محتوا.
* ثبت‌نام و ورود کاربر با JWT در کوکی httpOnly و دسترسی مبتنی بر نقش (کاربر / مدیر / مالک).
* پنل مدیریت برای افزودن/ویرایش/حذف محتوا، مدیریت کاربران، مشاهده آمار، و مدیریت بخش ویژه و تریلرها.
* طراحی واکنش‌گرا (موبایل + دسکتاپ) و RTL (UI فارسی).
* تم تاریک و امکان تغییر تم.

## تکنولوژی‌ها
### Frontend
* React 19, React Router v6, Axios, SweetAlert2, React Icons
* Lazy Loading + Suspense, ErrorBoundary
* Material‑UI (MUI) برای پنل مدیریت
* RTL و تم تاریک

### Backend
* Node.js, Express 5, Mongoose, MongoDB
* JWT (jsonwebtoken), bcrypt, Multer, cookie‑parser, express‑session, dotenv
* امنیت: JWT در کوکی httpOnly، دسترسی مبتنی بر نقش

## ساختار پروژه
```
MovieClub/
├── Backend/
│   ├── controller/     — Auth.js, content.js
│   ├── middlewares/    — isAuth.js, isAdmin.js
│   ├── models/         — user.js, content.js, siteSettings.js
│   ├── router/         — Auth.js, Content.js
│   ├── uploads/        — فایل‌های آپلود شده
│   └── Server.js
└── Frontend/
    ├── src/
    │   ├── Pages/      — Home, Movies, Series, Anime, Auth, Admin, …
    │   ├── components/ — Layout, UI, Admin, …
    │   ├── utils/      — auth.js, validation.js, logger.js
    │   └── App.js
    └── public/
```

## نحوه اجرا
### Backend
```bash
cd Backend
npm install
# کپی .env.example به .env و پر کردن مقادیر
cp .env.example .env
node Server.js
```

### Frontend
```bash
cd Frontend
npm install
npm start
```

## متغیرهای محیطی (Backend/.env)
```
PORT=3001
JWT_SECRET=your-jwt-secret
MONGO_URI=mongodb://localhost:27017/MovieClub
SESSION_SECRET=your-session-secret
CORS_ORIGIN=http://localhost:3000
```

## نکات تکمیلی
* برای تغییر تم یا فعال‌سازی حالت RTL، از تنظیمات در پنل مدیریت استفاده کنید.
* در صورت نیاز به افزودن محتوا یا کاربران جدید، از پنل مدیریت (Admin Panel) استفاده کنید.
* برای دسترسی به API، توکن JWT را در کوکی httpOnly دریافت کنید و در هدرهای درخواست استفاده کنید.

---
**توجه:** این مستندات برای ارائه پروژه نهایی دانشگاهی تهیه شده و به صورت حرفه‌ای و مختصر نگارش شده است.

