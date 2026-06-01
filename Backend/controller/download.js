const DownloadLink = require('../models/downloadLink');
const ContentSchema = require('../models/content');

// GET /downloads/:contentId — دریافت لینک‌های دانلود یک فیلم/سریال
exports.GetDownloadLinks = async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const links = await DownloadLink.find({ contentId }).sort({ quality: 1 });
        res.json(links);
    } catch (err) {
        next(err);
    }
};

// POST /downloads — افزودن لینک دانلود (فقط ادمین)
exports.PostDownloadLink = async (req, res, next) => {
    try {
        const { contentId, quality, size, url, encoder, subtitle, subtitleUrl, dubbed, label } = req.body;

        if (!contentId || !quality || !size || !url) {
            return res.status(400).json({ message: 'contentId، quality، size و url الزامی هستند' });
        }

        // بررسی وجود محتوا
        const content = await ContentSchema.findById(contentId);
        if (!content) {
            return res.status(404).json({ message: 'محتوای مورد نظر یافت نشد' });
        }

        const link = await DownloadLink.create({
            contentId, quality, size, url,
            encoder: encoder || '',
            subtitle: subtitle === true || subtitle === 'true',
            subtitleUrl: subtitleUrl || '',
            dubbed: dubbed === true || dubbed === 'true',
            label: label || ''
        });

        res.status(201).json({ message: 'لینک دانلود با موفقیت اضافه شد', data: link });
    } catch (err) {
        next(err);
    }
};

// DELETE /downloads/:id — حذف لینک دانلود (فقط ادمین)
exports.DeleteDownloadLink = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await DownloadLink.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'لینک یافت نشد' });
        }
        res.json({ message: 'لینک دانلود با موفقیت حذف شد' });
    } catch (err) {
        next(err);
    }
};

// PUT /downloads/:id — ویرایش لینک دانلود (فقط ادمین)
exports.EditDownloadLink = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quality, size, url, encoder, subtitle, subtitleUrl, dubbed, label } = req.body;

        const updated = await DownloadLink.findByIdAndUpdate(
            id,
            { quality, size, url, encoder, subtitle, subtitleUrl, dubbed, label },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'لینک یافت نشد' });
        }

        res.json({ message: 'لینک دانلود با موفقیت ویرایش شد', data: updated });
    } catch (err) {
        next(err);
    }
};
