const express = require('express');
const { GetLogin, PostLogin, GetRegister, PostRegister } = require('../controller/Auth');
const router = express.Router();
router.get('/login', GetLogin)
router.post('/login', PostLogin)
router.get('/register', GetRegister)
router.post('/register', PostRegister)
module.exports = router