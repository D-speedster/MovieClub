const express = require('express');
const {
    PostContent, GetContent, GetContentById, GetContentBySlug,
    GetSeriesList, GetBoxOffice, GetTrailers, DeleteContent,
    EditContent, GetStats, GetFeatured, SetFeatured,
    GetTop10, GetUpdatedSeries, GetRandomContent, SearchContent
} = require('../controller/content');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// ── Public routes (بدون احراز هویت) ──────────────────────────
router.get('/movieList',      GetContent);
router.get('/seriesList',     GetSeriesList);
router.get('/stats',          GetStats);
router.get('/boxoffice',      GetBoxOffice);
router.get('/trailers',       GetTrailers);
router.get('/featured',       GetFeatured);
router.get('/top10',          GetTop10);
router.get('/updated-series', GetUpdatedSeries);
router.get('/random',         GetRandomContent);
router.get('/search',         SearchContent);
router.get('/slug/:slug',     GetContentBySlug);
router.get('/:id',            GetContentById);

// ── Protected routes (فقط Admin/Owner) ───────────────────────
router.post('/new-content',   isAdmin, PostContent);
router.post('/featured',      isAdmin, SetFeatured);
router.put('/:id',            isAdmin, EditContent);
router.delete('/:id',         isAdmin, DeleteContent);

module.exports = router;
