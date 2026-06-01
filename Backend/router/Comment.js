const express = require('express');
const {
    GetComments,
    PostComment,
    GetAllComments,
    UpdateCommentStatus,
    DeleteComment,
    GetPendingCount
} = require('../controller/comment');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// ── Public ────────────────────────────────────────────────────
router.get('/count/pending', isAdmin, GetPendingCount);
router.get('/admin/all',     isAdmin, GetAllComments);
router.get('/:contentId',    GetComments);

// ── Protected (نیاز به login) ─────────────────────────────────
router.post('/', isAuth, PostComment);

// ── Admin only ────────────────────────────────────────────────
router.put('/:id/status',  isAdmin, UpdateCommentStatus);
router.delete('/:id',      isAdmin, DeleteComment);

module.exports = router;
