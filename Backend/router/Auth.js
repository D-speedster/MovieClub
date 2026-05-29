const express = require('express');
const { PostLogin, PostRegister, logout } = require('../controller/Auth');
const router = express.Router();
router.post('/login', PostLogin);
router.post('/register', PostRegister);
router.post('/logout', logout);
module.exports = router;