const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1000,
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    likes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
