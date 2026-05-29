require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/content');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const items = await Content.find({});
    items.forEach(i => console.log(`title: ${i.title} | poster: ${i.poster}`));
    process.exit(0);
});
