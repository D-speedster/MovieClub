const ContentSchema = require('../models/content')
const SiteSettings = require('../models/siteSettings')
const UserSchema = require('../models/user')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

// دانلود پوستر از URL و ذخیره در پوشه uploads (با پشتیبانی از redirect)
const downloadPosterFromUrl = (url, redirectCount = 0) => {
    return new Promise((resolve, reject) => {
        if (redirectCount > 5) {
            return reject(new Error('تعداد redirect بیش از حد مجاز است'));
        }

        const filename = Date.now() + '-poster.jpg';
        const filepath = path.join(__dirname, '..', 'uploads', filename);
        const protocol = url.startsWith('https') ? https : http;

        const request = protocol.get(url, (response) => {
            // دنبال redirect برو — قبل از باز کردن فایل
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
                response.resume(); // drain response
                return downloadPosterFromUrl(response.headers.location, redirectCount + 1)
                    .then(resolve)
                    .catch(reject);
            }

            if (response.statusCode !== 200) {
                response.resume();
                return reject(new Error(`دانلود پوستر ناموفق بود: status ${response.statusCode}`));
            }

            const file = fs.createWriteStream(filepath);

            file.on('error', (err) => {
                fs.unlink(filepath, () => {});
                reject(err);
            });

            response.pipe(file);

            file.on('finish', () => {
                file.close(() => resolve(filename));
            });
        });

        request.on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });

        request.setTimeout(15000, () => {
            request.destroy();
            fs.unlink(filepath, () => {});
            reject(new Error('timeout در دانلود پوستر'));
        });
    });
};

exports.PostContent = async (req, res, next) => {
    try {
        let { title, type, actors, director, directors, countries, writer, writers,
              genres, rate, duration, description, language, year } = req.body;

        let poster = req.file ? req.file.filename : null;
        console.log('[PostContent] body keys:', Object.keys(req.body));
        console.log('[PostContent] galleryUrls:', req.body.galleryUrls?.substring?.(0, 100));

        // ── اگه فایل آپلود نشده ولی URL پوستر داده شده، دانلود کن ──
        if (!poster && req.body.posterUrl) {
            try {
                poster = await downloadPosterFromUrl(req.body.posterUrl);
            } catch (downloadErr) {
                return res.status(400).json({ message: 'دانلود پوستر از URL ناموفق بود: ' + downloadErr.message });
            }
        }

        // ── poster الزامی است ─────────────────────────────────
        if (!poster) {
            return res.status(400).json({ message: 'پوستر الزامی است. لطفاً یک تصویر آپلود کنید یا از OMDB دریافت کنید.' });
        }

        // ── gallery از TMDB — URL ها مستقیم ذخیره میشن ────────
        let galleryFiles = [];
        if (req.body.galleryUrls) {
            try {
                galleryFiles = JSON.parse(req.body.galleryUrls);
            } catch {
                galleryFiles = req.body.galleryUrls.split(',').map(u => u.trim()).filter(Boolean);
            }
            console.log(`[Gallery] ${galleryFiles.length} URL ذخیره شد`);
        }

        // ── پردازش آرایه‌ها ───────────────────────────────────
        const genreList   = genres    ? genres.split(',').map(e => e.trim()).filter(Boolean)    : [];
        const actorList   = actors    ? actors.split(',').map(e => e.trim()).filter(Boolean)    : [];
        const countryList = countries ? countries.split(',').map(e => e.trim()).filter(Boolean) : [];

        // کارگردان — پشتیبانی از هر دو فرمت (رشته یا آرایه)
        let directorList = [];
        if (directors) {
            directorList = Array.isArray(directors)
                ? directors.filter(Boolean)
                : directors.split(',').map(s => s.trim()).filter(Boolean);
        } else if (director) {
            directorList = director.split(',').map(s => s.trim()).filter(Boolean);
        }

        // نویسنده — پشتیبانی از هر دو فرمت
        let writerList = [];
        if (writers) {
            writerList = Array.isArray(writers)
                ? writers.filter(Boolean)
                : writers.split(',').map(s => s.trim()).filter(Boolean);
        } else if (writer) {
            writerList = writer.split(',').map(s => s.trim()).filter(Boolean);
        }

        // ── پردازش مقادیر عددی — جلوگیری از NaN ─────────────
        const parsedYear     = year     && !isNaN(parseInt(year))     ? parseInt(year)       : undefined;
        const parsedRate     = rate     && !isNaN(parseFloat(rate))   ? parseFloat(rate)     : undefined;
        const parsedDuration = duration && !isNaN(parseInt(duration)) ? parseInt(duration)   : undefined;

        // ── نوع محتوا — فقط movie و series مجاز هستند ─────────
        const contentType = (type === 'series') ? 'series' : 'movie';

        // ── تولید slug و چک تکراری بودن ──────────────────────
        let slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        // اگه slug تکراری بود، عدد اضافه کن
        const existing = await ContentSchema.findOne({ slug });
        if (existing) {
            slug = slug + '-2';
            // اگه -2 هم بود، timestamp اضافه کن
            const existing2 = await ContentSchema.findOne({ slug });
            if (existing2) {
                slug = slug.replace(/-2$/, '') + '-' + Date.now().toString(36);
            }
        }

        const content = await ContentSchema.create({
            title,
            slug,
            type: contentType,
            languages: language ? [language] : [],
            year: parsedYear,
            directors: directorList,
            writers: writerList,
            actors: actorList,
            countries: countryList,
            genres: genreList,
            description,
            poster,
            gallery: galleryFiles,
            imdb: parsedRate !== undefined ? { rating: parsedRate } : { rating: 0 },
            movie: { duration: parsedDuration || 0 }
        });

        res.status(201).json({ message: 'محتوا با موفقیت اضافه شد', data: content });
    } catch (err) {
        console.log('[PostContent] ERROR:', err.code, err.message, err.errors ? JSON.stringify(err.errors) : '');
        next(err);
    }
}

exports.GetContent = async (req, res, next) => {
    try {
        const Movies = await ContentSchema.find({ type: 'movie' })
        res.json(Movies)
    } catch (err) {
        next(err);
    }
}

exports.GetSeriesList = async (req, res, next) => {
    try {
        const series = await ContentSchema.find({ type: 'series' });
        res.json(series);
    } catch (err) {
        next(err);
    }
}

exports.GetStats = async (req, res, next) => {
    try {
        const [movieCount, seriesCount, totalCount, topRated, userCount] = await Promise.all([
            ContentSchema.countDocuments({ type: 'movie' }),
            ContentSchema.countDocuments({ type: 'series' }),
            ContentSchema.countDocuments({}),
            ContentSchema.find({}).sort({ 'imdb.rating': -1 }).limit(5).select('title type imdb.rating poster'),
            UserSchema.countDocuments({})
        ]);
        res.json({ movieCount, seriesCount, totalCount, topRated, userCount });
    } catch (err) {
        next(err);
    }
}

exports.GetBoxOffice = async (req, res, next) => {
    try {
        const boxOffice = await ContentSchema.find({ 'imdb.rating': { $exists: true } })
            .sort({ 'imdb.rating': -1 })
            .limit(10);
        // اگر داده‌ای با rating نداشت، آخرین محتواها رو برگردون
        if (boxOffice.length === 0) {
            const latest = await ContentSchema.find({}).sort({ createdAt: -1 }).limit(10);
            return res.json(latest);
        }
        res.json(boxOffice);
    } catch (err) {
        next(err);
    }
}

exports.GetTrailers = async (req, res, next) => {
    try {
        const trailers = await ContentSchema.find({}).sort({ createdAt: -1 }).limit(12);
        res.json(trailers);
    } catch (err) {
        next(err);
    }
}

exports.GetContentBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        // اول با slug پیدا کن، اگه نبود با _id امتحان کن
        let content = await ContentSchema.findOne({ slug });
        if (!content && slug.match(/^[a-f\d]{24}$/i)) {
            content = await ContentSchema.findById(slug);
        }
        if (!content) {
            return res.status(404).json({ message: 'محتوا یافت نشد' });
        }
        res.json(content);
    } catch (err) {
        next(err);
    }
}

exports.GetContentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const content = await ContentSchema.findById(id);
        if (!content) {
            return res.status(404).json({ message: 'محتوا یافت نشد' });
        }
        res.json(content);
    } catch (err) {
        next(err);
    }
}

exports.DeleteContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await ContentSchema.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'محتوا یافت نشد' });
        }
        res.json({ message: 'محتوا با موفقیت حذف شد' });
    } catch (err) {
        next(err);
    }
}

exports.EditContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, type, actors, director, directors, countries, writer, writers, genres, rate, duration, description, language, year } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (type !== undefined) updateData.type = type;
        if (description !== undefined) updateData.description = description;
        if (year !== undefined) updateData.year = year ? parseInt(year) : undefined;
        if (language !== undefined) updateData.languages = [language];

        // کارگردان — پشتیبانی از هر دو فرمت
        if (directors !== undefined) {
            updateData.directors = Array.isArray(directors) ? directors : directors.split(',').map(s => s.trim()).filter(Boolean);
        } else if (director !== undefined) {
            updateData.directors = director ? director.split(',').map(s => s.trim()).filter(Boolean) : [];
        }

        // نویسنده — پشتیبانی از هر دو فرمت
        if (writers !== undefined) {
            updateData.writers = Array.isArray(writers) ? writers : writers.split(',').map(s => s.trim()).filter(Boolean);
        } else if (writer !== undefined) {
            updateData.writers = writer ? writer.split(',').map(s => s.trim()).filter(Boolean) : [];
        }

        if (actors !== undefined) {
            updateData.actors = Array.isArray(actors) ? actors : actors.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (countries !== undefined) {
            updateData.countries = Array.isArray(countries) ? countries : countries.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (genres !== undefined) {
            updateData.genres = Array.isArray(genres) ? genres : genres.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (rate !== undefined) {
            updateData.imdb = { rating: parseFloat(rate) };
        }
        if (duration !== undefined) {
            updateData.movie = { duration: parseInt(duration) };
        }
        if (req.file) {
            updateData.poster = req.file.filename;
        }

        const updated = await ContentSchema.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ message: 'محتوا یافت نشد' });
        }
        res.json({ message: 'محتوا با موفقیت ویرایش شد', data: updated });
    } catch (err) {
        next(err);
    }
};

// دریافت محتوای پیشنهادی (ست شده توسط ادمین)
exports.GetFeatured = async (req, res, next) => {
    try {
        const setting = await SiteSettings.findOne({ key: 'featured_content' });
        if (!setting || !setting.value || setting.value.length === 0) {
            // اگه ادمین هنوز ست نکرده، برترین‌ها رو برگردون
            const fallback = await ContentSchema.find({ 'imdb.rating': { $gt: 0 } })
                .sort({ 'imdb.rating': -1 })
                .limit(12);
            return res.json(fallback);
        }
        // آیدی‌های ست شده رو fetch کن
        const ids = setting.value;
        const contents = await ContentSchema.find({ _id: { $in: ids } });
        // ترتیب رو حفظ کن
        const ordered = ids
            .map(id => contents.find(c => c._id.toString() === id.toString()))
            .filter(Boolean);
        res.json(ordered);
    } catch (err) {
        next(err);
    }
};

// ست کردن محتوای پیشنهادی توسط ادمین
exports.SetFeatured = async (req, res, next) => {
    try {
        const { contentIds } = req.body;
        if (!Array.isArray(contentIds)) {
            return res.status(400).json({ message: 'contentIds باید آرایه باشد' });
        }
        const setting = await SiteSettings.findOneAndUpdate(
            { key: 'featured_content' },
            { key: 'featured_content', value: contentIds, description: 'محتوای پیشنهادی صفحه اصلی' },
            { upsert: true, new: true }
        );
        res.json({ message: 'پیشنهادی‌ها با موفقیت ذخیره شد', data: setting });
    } catch (err) {
        next(err);
    }
};

// دریافت 10 عنوان برتر
exports.GetTop10 = async (req, res, next) => {
    try {
        const top10 = await ContentSchema.find({ 'imdb.rating': { $gt: 0 } })
            .sort({ 'imdb.rating': -1 })
            .limit(10);
        res.json(top10);
    } catch (err) {
        next(err);
    }
};

// دریافت سریال‌های بروز شده (جدیدترین سریال‌ها)
exports.GetUpdatedSeries = async (req, res, next) => {
    try {
        const series = await ContentSchema.find({ type: 'series' })
            .sort({ updatedAt: -1 })
            .limit(12);
        res.json(series);
    } catch (err) {
        next(err);
    }
};

// دریافت محتوای تصادفی (به انتخاب خودت)
exports.GetRandomContent = async (req, res, next) => {
    try {
        const count = await ContentSchema.countDocuments({});
        const limit = 12;
        if (count === 0) return res.json([]);
        const random = await ContentSchema.aggregate([{ $sample: { size: limit } }]);
        res.json(random);
    } catch (err) {
        next(err);
    }
};

// جستجو در محتوا — GET /content/search?q=کلمه
exports.SearchContent = async (req, res, next) => {
    try {
        const { q, type } = req.query;
        if (!q || q.trim().length < 1) {
            return res.json([]);
        }
        const query = q.trim();
        const filter = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { actors: { $regex: query, $options: 'i' } },
                { genres: { $regex: query, $options: 'i' } }
            ]
        };
        if (type && (type === 'movie' || type === 'series')) {
            filter.type = type;
        }
        const results = await ContentSchema.find(filter)
            .select('title type year poster imdb genres slug')
            .limit(20);
        res.json(results);
    } catch (err) {
        next(err);
    }
};

