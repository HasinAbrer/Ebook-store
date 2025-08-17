require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Book = require('./src/books/book.model');

(async function main() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('Missing MONGO_URI in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Read books.json from frontend/public
    const booksJsonPath = path.resolve(__dirname, '..', 'frontend', 'public', 'books.json');
    if (!fs.existsSync(booksJsonPath)) {
      console.error('books.json not found at:', booksJsonPath);
      process.exit(1);
    }

    const raw = fs.readFileSync(booksJsonPath, 'utf-8');
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) {
      console.error('books.json must be an array of books');
      process.exit(1);
    }

    let upserts = 0;
    for (const b of items) {
      // Map to model fields and provide sensible defaults
      const title = String(b.title || '').trim();
      if (!title) continue;

      const doc = {
        title,
        description: String(b.description || 'No description provided'),
        category: String(b.category || 'general').toLowerCase(),
        trending: Boolean(b.trending || false),
        // Serve from backend static images: /images/<file>
        coverImage: b.coverImage ? `/images/${b.coverImage}` : '/images/placeholder.png',
        oldPrice: Number(b.oldPrice || 0),
        newPrice: Number(b.newPrice || 0),
        stock: typeof b.stock === 'number' ? b.stock : 50,
        totalSold: typeof b.totalSold === 'number' ? b.totalSold : 0,
        ratingAvg: typeof b.ratingAvg === 'number' ? b.ratingAvg : 0,
        ratingCount: typeof b.ratingCount === 'number' ? b.ratingCount : 0,
      };

      await Book.findOneAndUpdate(
        { title: doc.title, category: doc.category },
        { $set: doc },
        { upsert: true, new: true }
      );
      upserts += 1;
    }

    console.log(`✅ Seed completed. Upserted/processed: ${upserts}`);
    console.log('\nNext steps:');
    console.log('- Put your image files into Backend/src/images as book-*.png');
    console.log('- Ensure Backend serves "/images" (index.js already does)');
    console.log('- Visit GET http://localhost:5000/api/books to verify');
  } catch (err) {
    console.error('❌ Seed failed:', err?.message || err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
