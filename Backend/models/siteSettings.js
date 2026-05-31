const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SiteSettingsSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    value: {
        type: Schema.Types.Mixed,
        required: true
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
