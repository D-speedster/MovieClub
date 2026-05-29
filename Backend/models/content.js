const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true
    },
    type: {
        type: String,
        enum: ["movie", "series", "anime", "animation"],
        index: true
    },
    year: {
        type: Number,
        min: 1900,
    },
    writer: String,
    language: String,
    poster: String,
    genres: [String],
    director: String,
    actors: [String],
    countries: [String],
    gallery: String,
    description: String,
    imdb: {
        rating: Number,
        votes: Number
    },
    movie: {
        duration: Number // مدت زمان به دقیقه
    },
    series: {
        seasonsCount: Number,
        episodesCount: Number,
        isWeekly: Boolean
    }
}, {
    timestamps: true // 
});
ContentSchema.pre("validate", function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w]+/g, "-")
            .replace(/^-+|-+$/g, "")
    }
    next()
})
module.exports = mongoose.model('Content', ContentSchema)