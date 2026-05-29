const mongoose = require('mongoose');
require('dotenv').config();
const ContentSchema = require('./models/content');

async function migrateSlug() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const contents = await ContentSchema.find({ slug: { $in: [null, '', undefined] } });
    console.log(`Found ${contents.length} items without slug`);

    for (const item of contents) {
        const baseSlug = item.title
            .toLowerCase()
            .replace(/[^\w\u0600-\u06FF]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // اگه slug تکراری بود، _id کوتاه اضافه کن
        let slug = baseSlug;
        const existing = await ContentSchema.findOne({ slug, _id: { $ne: item._id } });
        if (existing) {
            slug = `${baseSlug}-${item._id.toString().slice(-4)}`;
        }

        await ContentSchema.findByIdAndUpdate(item._id, { slug });
        console.log(`✅ ${item.title} → ${slug}`);
    }

    console.log('Migration complete');
    process.exit(0);
}

migrateSlug().catch(err => {
    console.error(err.message);
    process.exit(1);
});
