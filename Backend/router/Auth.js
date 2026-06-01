const express = require('express');
const { PostLogin, PostRegister, logout } = require('../controller/Auth');
const isAuth = require('../middlewares/isAuth');
const UserSchema = require('../models/user');
const router = express.Router();

router.post('/login', PostLogin);
router.post('/register', PostRegister);
router.post('/logout', logout);

// GET /auth/me — اطلاعات کاربر لاگین‌شده
router.get('/me', isAuth, async (req, res) => {
    try {
        const user = await UserSchema.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'خطای سرور' });
    }
});

module.exports = router;
