const express = require('express');
const { GetTrailers, PostTrailer, DeleteTrailer } = require('../controller/trailer');
const isAdmin = require('../middlewares/isAdmin');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ── Public ────────────────────────────────────────────────────
router.get('/', GetTrailers);

// ── Protected (فقط Admin/Owner) ───────────────────────────────
router.post('/',    isAdmin, upload.single('poster'), PostTrailer);
router.delete('/:id', isAdmin, DeleteTrailer);

module.exports = router;
