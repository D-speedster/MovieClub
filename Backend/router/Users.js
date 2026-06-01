const express = require('express');
const { GetUsers, GetUserById, UpdateUserRole, DeleteUser, GetUserCount } = require('../controller/users');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// ── Protected (فقط Admin/Owner) ───────────────────────────────
router.get('/',        isAdmin, GetUsers);
router.get('/count',   isAdmin, GetUserCount);
router.get('/:id',     isAdmin, GetUserById);
router.put('/:id',     isAdmin, UpdateUserRole);
router.delete('/:id',  isAdmin, DeleteUser);

module.exports = router;
