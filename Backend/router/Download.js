const express = require('express');
const { GetDownloadLinks, PostDownloadLink, DeleteDownloadLink, EditDownloadLink } = require('../controller/download');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// ── Public ────────────────────────────────────────────────────
router.get('/:contentId', GetDownloadLinks);

// ── Protected (فقط Admin/Owner) ───────────────────────────────
router.post('/',        isAdmin, PostDownloadLink);
router.put('/:id',     isAdmin, EditDownloadLink);
router.delete('/:id',  isAdmin, DeleteDownloadLink);

module.exports = router;
