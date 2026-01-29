const express = require('express');
const { PostContent } = require('../controller/content');
const router = express.Router();
router.post('/new-content', PostContent)
module.exports = router