const Trailer = require('../models/trailer');

exports.GetTrailers = async (req, res, next) => {
    try {
        const trailers = await Trailer.find({}).sort({ createdAt: -1 });
        res.json(trailers);
    } catch (err) { next(err); }
};

exports.PostTrailer = async (req, res, next) => {
    try {
        const { title, youtubeUrl, contentId } = req.body;
        const poster = req.file ? req.file.filename : null;
        const trailer = await Trailer.create({ title, youtubeUrl, poster, contentId });
        res.status(201).json({ message: 'تریلر اضافه شد', data: trailer });
    } catch (err) { next(err); }
};

exports.DeleteTrailer = async (req, res, next) => {
    try {
        const deleted = await Trailer.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'تریلر یافت نشد' });
        res.json({ message: 'تریلر حذف شد' });
    } catch (err) { next(err); }
};
