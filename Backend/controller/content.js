const ContentSchema = require('../models/content')
const SiteSettings = require('../models/siteSettings')

exports.PostContent = async (req, res, next) => {
    try {
        let { title, type, actors, director, countries, writer, genres, rate, duration, description, language, year } = req.body;
        const poster = req.file ? req.file.filename : null;
        const genreList = genres ? genres.split(',').map((e) => e.trim()) : [];
        const actorList = actors ? actors.split(',').map((e) => e.trim()) : [];
        const countryList = countries ? countries.split(',').map((e) => e.trim()) : [];

        const content = await ContentSchema.create({
            title, type, language,
            year: year ? parseInt(year) : undefined,
            director, writer,
            actors: actorList,
            countries: countryList,
            genres: genreList,
            description, poster,
            imdb: rate ? { rating: parseFloat(rate) } : undefined,
            movie: duration ? { duration: parseInt(duration) } : undefined
        });
        res.status(201).json({ message: 'محتوا با موفقیت اضافه شد', data: content });
    } catch (err) {
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
        const [movieCount, seriesCount, totalCount, topRated] = await Promise.all([
            ContentSchema.countDocuments({ type: 'movie' }),
            ContentSchema.countDocuments({ type: 'series' }),
            ContentSchema.countDocuments({}),
            ContentSchema.find({}).sort({ 'imdb.rating': -1 }).limit(5).select('title type imdb.rating poster')
        ]);
        res.json({ movieCount, seriesCount, totalCount, topRated });
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
        const { title, type, actors, director, countries, writer, genres, rate, duration, description } = req.body;
        const updateData = { title, type, actors, director, countries, writer, rate, duration, description };
        if (genres) {
            updateData.genres = genres.split(',').map((e) => e.trim());
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

