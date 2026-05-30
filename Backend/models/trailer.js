const mongoose = require('mongoose');

const TrailerSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    youtubeUrl: { type: String, trim: true },
    poster: { type: String },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' }
}, { timestamps: true });

module.exports = mongoose.model('Trailer', TrailerSchema);
