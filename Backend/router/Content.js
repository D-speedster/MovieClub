const express = require('express');
const { PostContent, GetContent, GetContentById, GetContentBySlug, GetSeriesList, GetBoxOffice, GetTrailers, DeleteContent, EditContent, GetStats, GetFeatured, SetFeatured, GetTop10, GetUpdatedSeries, GetRandomContent } = require('../controller/content');
const router = express.Router();
router.get('/movieList', GetContent)
router.get('/seriesList', GetSeriesList)
router.get('/stats', GetStats)
router.get('/boxoffice', GetBoxOffice)
router.get('/trailers', GetTrailers)
router.get('/featured', GetFeatured)
router.post('/featured', SetFeatured)
router.get('/top10', GetTop10)
router.get('/updated-series', GetUpdatedSeries)
router.get('/random', GetRandomContent)
router.get('/slug/:slug', GetContentBySlug)
router.get('/:id', GetContentById)
router.post('/new-content', PostContent)
router.delete('/:id', DeleteContent)
router.put('/:id', EditContent)
module.exports = router