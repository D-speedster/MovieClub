const express = require('express');
const { PostContent, GetContent, GetBoxOffice, GetTrailers, DeleteContent, EditContent } = require('../controller/content');
const router = express.Router();
router.get('/movieList', GetContent)
router.get('/boxoffice', GetBoxOffice)
router.get('/trailers', GetTrailers)
router.post('/new-content', PostContent)
router.delete('/:id', DeleteContent)
router.put('/:id', EditContent)
module.exports = router