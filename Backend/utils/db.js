const { default: mongoose } = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/MovieClub', {
            // این options دیگه لازم نیست توی نسخه‌های جدید
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('اتصال به MongoDB برقرار شد ✅');
    } catch (error) {
        console.error('خطا در اتصال به MongoDB:', error);
        process.exit(1); // خروج از برنامه
    }
};

module.exports = connectDB;
