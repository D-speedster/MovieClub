require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Content = require("./models/content");

const OMDB_API_KEY = "e49bd8ed";
const UPLOAD_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ─── تابع دانلود هوشمند با کنترل تایم‌اوت استریم ───────────────────────────
async function downloadFile(url, destPath) {
    const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream",
        timeout: 10000, // تایم‌اوت ۱۰ ثانیه‌ای برای شروع اتصال
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.imdb.com/"
        }
    });

    const writer = fs.createWriteStream(destPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        // ایجاد یک تایمر برای لغو عملیات در صورت گیر کردن استریم (بیش از ۱۰ ثانیه سکوت)
        const streamTimeout = setTimeout(() => {
            response.data.destroy(); // قطع جریان استریم
            writer.end();
            fs.unlink(destPath, () => {});
            reject(new Error("تایم‌اوت استریم: سرعت دانلود صفر شد و انتقال داده متوقف گردید"));
        }, 10000);

        writer.on("finish", () => {
            clearTimeout(streamTimeout);
            resolve();
        });

        writer.on("error", (err) => {
            clearTimeout(streamTimeout);
            fs.unlink(destPath, () => {});
            reject(err);
        });
    });
}

// ─── تابع جستجو در OMDb ────────────────────────────────────────────────
async function searchOMDb(title, year, type) {
    const omdbType = type === "series" ? "series" : "movie";
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&type=${omdbType}&apikey=${OMDB_API_KEY}`;

    const response = await axios.get(url, { timeout: 10000 });
    if (response.data && response.data.Response === "True") {
        return response.data;
    }
    return null;
}

// ─── تابع اصلی ─────────────────────────────────────────────────────────
async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ اتصال به دیتابیس برقرار شد\n");

    const contents = await Content.find({ poster: { $exists: true, $ne: "" } });
    console.log(`📦 تعداد کل محتوای بررسی شونده: ${contents.length}\n`);

    let downloaded = 0, skipped = 0, failed = 0;

    for (const item of contents) {
        const destPath = path.join(UPLOAD_DIR, item.poster);

        if (fs.existsSync(destPath)) {
            console.log(`⏭️  موجود است: ${item.title} (${item.poster})`);
            skipped++;
            continue;
        }

        console.log(`🔍 جستجو در OMDb: ${item.title} (${item.year}) [${item.type}]`);

        try {
            const movieData = await searchOMDb(item.title, item.year, item.type);

            if (!movieData || !movieData.Poster || movieData.Poster === "N/A") {
                console.log(`   ❌ پوستر در OMDb یافت نشد\n`);
                failed++;
                continue;
            }

            console.log(`   ⬇️  شروع دانلود پوستر...`);
            await downloadFile(movieData.Poster, destPath);
            console.log(`   ✅ با موفقیت ذخیره شد: ${item.poster}\n`);
            downloaded++;

            await new Promise(r => setTimeout(r, 500)); // نیم ثانیه تاخیر معمولی

        } catch (err) {
            console.log(`   ❌ خطا در فرآیند: ${err.message}\n`);
            failed++;
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    console.log("─".repeat(45));
    console.log(`✅ کل پوسترهای دانلود شده:  ${downloaded}`);
    console.log(`⏭️  از قبل موجود بود:        ${skipped}`);
    console.log(`❌ عملیات ناموفق:            ${failed}`);

    await mongoose.disconnect();
    console.log("\n🔌 قطع اتصال با دیتابیس. پایان عملیات.");
}

main().catch(err => {
    console.error("خطای بحرانی سیستم:", err);
    process.exit(1);
});