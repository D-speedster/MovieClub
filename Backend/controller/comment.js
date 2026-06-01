const Comment = require('../models/comment');
const ContentSchema = require('../models/content');

// GET /comments/:contentId — دریافت نظرات تایید شده یک فیلم/سریال
exports.GetComments = async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const comments = await Comment.find({
            contentId,
            status: 'approved'
        }).sort({ createdAt: -1 }).limit(50);
        res.json(comments);
    } catch (err) {
        next(err);
    }
};

// POST /comments — ارسال نظر جدید (نیاز به login)
exports.PostComment = async (req, res, next) => {
    try {
        const { contentId, text, rating } = req.body;

        if (!contentId || !text || text.trim().length < 3) {
            return res.status(400).json({ message: 'contentId و متن نظر (حداقل ۳ کاراکتر) الزامی هستند' });
        }

        const content = await ContentSchema.findById(contentId);
        if (!content) {
            return res.status(404).json({ message: 'محتوای مورد نظر یافت نشد' });
        }

        const comment = await Comment.create({
            contentId,
            userId: req.user.userId,
            username: req.user.name || 'کاربر',
            text: text.trim(),
            rating: rating ? parseFloat(rating) : null
        });

        res.status(201).json({ message: 'نظر شما با موفقیت ثبت شد', data: comment });
    } catch (err) {
        next(err);
    }
};

// GET /comments/admin/all — همه نظرات برای پنل ادمین
exports.GetAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({})
            .populate('contentId', 'title type')
            .sort({ createdAt: -1 })
            .limit(200);
        res.json(comments);
    } catch (err) {
        next(err);
    }
};

// PUT /comments/:id/status — تغییر وضعیت نظر توسط ادمین
exports.UpdateCommentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ['pending', 'approved', 'rejected'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'وضعیت نامعتبر است' });
        }
        const updated = await Comment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'نظر یافت نشد' });
        res.json({ message: 'وضعیت نظر تغییر کرد', data: updated });
    } catch (err) {
        next(err);
    }
};

// DELETE /comments/:id — حذف نظر توسط ادمین
exports.DeleteComment = async (req, res, next) => {
    try {
        const deleted = await Comment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'نظر یافت نشد' });
        res.json({ message: 'نظر با موفقیت حذف شد' });
    } catch (err) {
        next(err);
    }
};

// GET /comments/count — تعداد نظرات در انتظار (برای داشبورد)
exports.GetPendingCount = async (req, res, next) => {
    try {
        const count = await Comment.countDocuments({ status: 'pending' });
        res.json({ count });
    } catch (err) {
        next(err);
    }
};
