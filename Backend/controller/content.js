const ContentSchema = require('../models/content')

exports.PostContent = async (req, res, next) => {
    try {
        let { title, type, actors, director, countries, writer, genres, rate, duration, description } = req.body
        const poster = req.file ? req.file.filename : null;
        const genreList = genres ? genres.split(',').map((e) => e.trim()) : [];
        const content = await ContentSchema.create({
            title, type, actors, director, countries, writer,
            genres: genreList, rate, duration, description, poster
        });
        res.status(201).json({ message: 'محتوا با موفقیت اضافه شد', data: content });
    } catch (err) {
        next(err);
    }
}

exports.GetContent = async (req, res, next) => {
    try {
        const Movies = await ContentSchema.find({})
        res.json(Movies)
    } catch (err) {
        next(err);
    }
}

exports.GetSeriesList = async (req, res, next) => {
    try {
        const series = await ContentSchema.find({ type: { $in: ['series', 'anime', 'animation'] } });
        res.json(series);
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

