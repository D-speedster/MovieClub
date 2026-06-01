const SiteSettings = require('../models/siteSettings');

// دریافت یک setting با key
exports.GetSetting = async (req, res, next) => {
    try {
        const { key } = req.params;
        const setting = await SiteSettings.findOne({ key });
        if (!setting) return res.json({ key, value: null });
        res.json(setting);
    } catch (err) {
        next(err);
    }
};

// ذخیره/آپدیت یک setting (بدون فایل)
exports.SetSetting = async (req, res, next) => {
    try {
        const { key } = req.params;
        const { value, description } = req.body;
        const setting = await SiteSettings.findOneAndUpdate(
            { key },
            { key, value, description },
            { upsert: true, new: true }
        );
        res.json({ message: 'تنظیم ذخیره شد', data: setting });
    } catch (err) {
        next(err);
    }
};

// آپلود عکس hero برای یک صفحه
// key مثلاً: hero_movies یا hero_series
exports.UploadHeroImage = async (req, res, next) => {
    try {
        const { key } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'فایل تصویر ارسال نشده' });
        }
        const filename = req.file.filename;
        const setting = await SiteSettings.findOneAndUpdate(
            { key },
            { key, value: filename, description: `Hero image for ${key}` },
            { upsert: true, new: true }
        );
        res.json({ message: 'تصویر hero با موفقیت آپلود شد', data: setting, filename });
    } catch (err) {
        next(err);
    }
};
