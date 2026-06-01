const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');

/**
 * isAdmin middleware
 * - ابتدا token را از cookie می‌خواند
 * - سپس role کاربر را از دیتابیس بررسی می‌کند
 * - فقط Admin و Owner اجازه دارند
 */
const isAdmin = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // role را از دیتابیس بخوان (نه از token — برای جلوگیری از stale data)
        const user = await UserSchema.findById(decoded.userId).select('role');
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        if (user.role !== 'Admin' && user.role !== 'Owner') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        req.user.role = user.role;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = isAdmin;
