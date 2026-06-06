require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('../models/content');
const DownloadLink = require('../models/downloadLink');

const FAKE_LINKS = [
  {
    quality: '720p',
    size: '1.2 GB',
    encoder: 'x264',
    url: 'https://dl.movieclub.ir/720p/movie.mkv',
    subtitle: true,
    dubbed: false,
    label: 'کیفیت HD'
  },
  {
    quality: '1080p',
    size: '2.8 GB',
    encoder: 'x265',
    url: 'https://dl.movieclub.ir/1080p/movie.mkv',
    subtitle: true,
    dubbed: false,
    label: 'کیفیت Full HD'
  }
];

async function seedDownloadLinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const movies = await Content.find({ type: 'movie' })
      .sort({ createdAt: -1 })
      .limit(20);

    if (movies.length === 0) {
      console.log('No movies found in database.');
      process.exit(0);
    }

    console.log(`Found ${movies.length} movies. Adding download links...`);

    let added = 0;
    let skipped = 0;

    for (const movie of movies) {
      const existing = await DownloadLink.find({ contentId: movie._id });
      if (existing.length > 0) {
        console.log(`  SKIP: "${movie.title}" already has ${existing.length} link(s)`);
        skipped++;
        continue;
      }

      for (const link of FAKE_LINKS) {
        await DownloadLink.create({
          contentId: movie._id,
          quality: link.quality,
          size: link.size,
          encoder: link.encoder,
          url: link.url,
          subtitle: link.subtitle,
          dubbed: link.dubbed,
          label: link.label
        });
      }

      console.log(`  OK: "${movie.title}" — 2 links added (720p + 1080p)`);
      added++;
    }

    console.log('');
    console.log(`Done! Added links to ${added} movies, skipped ${skipped}.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seedDownloadLinks();