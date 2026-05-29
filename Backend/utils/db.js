const { default: mongoose } = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/MovieClub');
        console.log('اتصال به MongoDB برقرار شد ✅');
    } catch (error) {
        console.error('خطا در اتصال به MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
