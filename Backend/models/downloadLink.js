const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DownloadLinkSchema = new Schema({
    contentId: {
        type: Schema.Types.ObjectId,
        ref: 'Content',
        required: true,
        index: true
    },
    quality: {
        type: String,
        required: true,
        enum: ['480p', '720p', '1080p', '4K', 'BluRay', 'WEB-DL', 'HDCAM'],
        default: '1080p'
    },
    size: {
        type: String,
        required: true,
        trim: true
        // مثال: "1.2 GB"
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    encoder: {
        type: String,
        trim: true,
        default: ''
        // مثال: x264, x265, HEVC
    },
    subtitle: {
        type: Boolean,
        default: false
    },
    subtitleUrl: {
        type: String,
        trim: true,
        default: ''
    },
    dubbed: {
        type: Boolean,
        default: false
        // آیا دوبله فارسی دارد؟
    },
    label: {
        type: String,
        trim: true,
        default: ''
        // توضیح اضافه مثل "دوبله فارسی + زیرنویس"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DownloadLink', DownloadLinkSchema);
