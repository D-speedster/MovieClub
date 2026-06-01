const express = require('express');
const multer = require('multer');
const path = require('path');
const { GetSetting, SetSetting, UploadHeroImage } = require('../controller/settings');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.params.key}-${Date.now()}${ext}`);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ── Public (خواندن تنظیمات برای فرانت‌اند) ───────────────────
router.get('/:key', GetSetting);

// ── Protected (فقط Admin/Owner) ───────────────────────────────
router.post('/:key',                isAdmin, SetSetting);
router.post('/:key/upload', isAdmin, upload.single('image'), UploadHeroImage);

module.exports = router;
