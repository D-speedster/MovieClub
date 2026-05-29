const express = require('express');
const { PostContent, GetContent, GetContentById, GetContentBySlug, GetSeriesList, GetBoxOffice, GetTrailers, DeleteContent, EditContent } = require('../controller/content');
const router = express.Router();
router.get('/movieList', GetContent)
router.get('/seriesList', GetSeriesList)
router.get('/boxoffice', GetBoxOffice)
router.get('/trailers', GetTrailers)
router.get('/slug/:slug', GetContentBySlug)
router.get('/:id', GetContentById)
router.post('/new-content', PostContent)
router.delete('/:id', DeleteContent)
router.put('/:id', EditContent)
module.exports = router