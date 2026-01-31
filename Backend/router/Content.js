const express = require('express');
const { PostContent, GetContent } = require('../controller/content');
const router = express.Router();
router.get('/movieList', GetContent)
router.post('/new-content', PostContent)
module.exports = router