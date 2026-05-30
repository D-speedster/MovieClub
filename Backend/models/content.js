const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 150,
        trim: true
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true, // اسلاگ باید یکتا باشد
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ["movie", "series"], // انیمیشن و انیمه به ژانر منتقل شدند
        index: true
    },
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 2 // جلوگیری از ثبت سال‌های نامعتبر آینده
    },
    writers: {
        type: [String],
        default: []
    },
    directors: {
        type: [String],
        default: []
    },
    languages: {
        type: [String],
        default: []
    },
    poster: {
        type: String,
        required: true
    },
    genres: {
        type: [String],
        required: true,
        index: true // ایندکس برای فیلتر سریع بر اساس ژانر
    },
    actors: {
        type: [String],
        default: []
    },
    countries: {
        type: [String],
        default: []
    },
    gallery: {
        type: [String], // گالری تصاویر معمولاً آرایه‌ای از آدرس‌هاست
        default: []
    },
    description: {
        type: String,
        trim: true
    },
    imdb: {
        rating: { type: Number, min: 0, max: 10, default: 0 },
        votes: { type: Number, default: 0 }
    },
    // فیلدهای اختصاصی فیلم
    movie: {
        duration: { type: Number, default: 0 } // مدت زمان به دقیقه
    },
    // فیلدهای اختصاصی سریال
    series: {
        seasonsCount: { type: Number, default: 0 },
        episodesCount: { type: Number, default: 0 },
        isWeekly: { type: Boolean, default: false },
        status: { 
            type: String, 
            enum: ["ongoing", "ended", "canceled"], 
            default: "ended" 
        }
    }
}, {
    timestamps: true
});

// هوک Pre-Save برای تولید خودکار اسلاگ (پشتیبانی از عنوان فارسی و انگلیسی)
ContentSchema.pre("save", function (next) {
    if (this.isModified("title") && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "") // پشتیبانی از حروف فارسی و انگلیسی
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }
    next();
});

module.exports = mongoose.model('Content', ContentSchema);