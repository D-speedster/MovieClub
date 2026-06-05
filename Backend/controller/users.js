const UserSchema = require('../models/user');

// GET /users — لیست همه کاربران
exports.GetUsers = async (req, res, next) => {
    try {
        const users = await UserSchema.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

// GET /users/count — تعداد کاربران (برای داشبورد)
exports.GetUserCount = async (req, res, next) => {
    try {
        const count = await UserSchema.countDocuments({});
        res.json({ count });
    } catch (err) {
        next(err);
    }
};

// GET /users/:id — اطلاعات یک کاربر
exports.GetUserById = async (req, res, next) => {
    try {
        const user = await UserSchema.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

// PUT /users/:id — تغییر role کاربر
exports.UpdateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const allowedRoles = ['User', 'Admin', 'Owner'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'نقش نامعتبر است' });
        }
        // Prevent self‑role change
        if (req.user && req.user.userId === req.params.id) {
            return res.status(403).json({ message: 'نمی‌توانید نقش خود را تغییر دهید' });
        }
        // Owner creation restriction
        if (role === 'Owner') {
            // Only an existing Owner can create another Owner
            if (!req.user || req.user.role !== 'Owner') {
                return res.status(403).json({ message: 'فقط Owner می‌تواند Owner جدید ایجاد کند' });
            }
        } else if (role === 'Admin') {
            // Admins can be created by Owner or Admin, but not by regular User
            if (!req.user || (req.user.role !== 'Owner' && req.user.role !== 'Admin')) {
                return res.status(403).json({ message: 'دسترسی برای ایجاد Admin ندارید' });
            }
        }
        const updated = await UserSchema.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        if (!updated) return res.status(404).json({ message: 'کاربر یافت نشد' });
        res.json({ message: 'نقش کاربر با موفقیت تغییر کرد', data: updated });
    } catch (err) {
        next(err);
    }
};

// DELETE /users/:id — حذف کاربر
exports.DeleteUser = async (req, res, next) => {
    try {
        // جلوگیری از حذف خود ادمین
        if (req.user.userId === req.params.id) {
            return res.status(400).json({ message: 'نمی‌توانید حساب خود را حذف کنید' });
        }
        const deleted = await UserSchema.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'کاربر یافت نشد' });
        res.json({ message: 'کاربر با موفقیت حذف شد' });
    } catch (err) {
        next(err);
    }
};
