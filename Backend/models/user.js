const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true
    },
    role: String,
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    } , 
    email: {
        required: true,
        type: String,
        unique: true,

    },
    phone: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);