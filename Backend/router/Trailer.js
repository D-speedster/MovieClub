const express = require('express');
const { GetTrailers, PostTrailer, DeleteTrailer } = require('../controller/trailer');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', GetTrailers);
router.post('/', upload.single('poster'), PostTrailer);
router.delete('/:id', DeleteTrailer);

module.exports = router;
