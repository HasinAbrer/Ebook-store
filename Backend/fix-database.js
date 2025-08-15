const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Drop stale/incorrect indexes first
    console.log('🗑️ Dropping username index...');
    try {
      await db.collection('users').dropIndex('username_1');
      console.log('✅ Username index dropped successfully');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ Username index does not exist, continuing...');
      } else {
        console.log('⚠️ Error dropping email index:', error.message);
      }
    }

    console.log('🗑️ Dropping email index...');
    try {
      await db.collection('users').dropIndex('email_1');
      console.log('✅ Email index dropped successfully');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ Email index does not exist, continuing...');
      } else {
        console.log('⚠️ Error dropping email index:', error.message);
      }
    }

    // Clean up any users with null username fields
    console.log('🧹 Cleaning up users with null username...');
    const result = await db.collection('users').deleteMany({ username: null });
    console.log(`✅ Cleaned up ${result.deletedCount} users with null username`);

    // Normalize usernames: trim and lowercase existing records
    console.log('🧽 Normalizing usernames (trim + lowercase)...');
    const users = await db.collection('users').find({}, { projection: { _id: 1, username: 1 } }).toArray();
    let updated = 0;
    for (const u of users) {
      const current = typeof u.username === 'string' ? u.username : '';
      const normalized = current.trim().toLowerCase();
      if (normalized && normalized !== current) {
        try {
          await db.collection('users').updateOne({ _id: u._id }, { $set: { username: normalized } });
          updated++;
        } catch (e) {
          console.log(`⚠️ Failed to normalize username for _id=${u._id}:`, e.message);
        }
      }
    }
    console.log(`✅ Normalized ${updated} usernames`);

    // Remove duplicates by username keeping the earliest created
    console.log('🧯 Resolving duplicate usernames (keeping earliest)...');
    const dupAgg = await db.collection('users').aggregate([
      { $group: { _id: '$username', ids: { $push: { id: '$_id', createdAt: '$createdAt' } }, count: { $sum: 1 } } },
      { $match: { _id: { $ne: null }, count: { $gt: 1 } } }
    ]).toArray();
    let removed = 0;
    for (const g of dupAgg) {
      // sort by createdAt asc; fallback to ObjectId timestamp if needed
      const sorted = g.ids.sort((a, b) => {
        const ca = a.createdAt ? new Date(a.createdAt).getTime() : a.id.getTimestamp().getTime();
        const cb = b.createdAt ? new Date(b.createdAt).getTime() : b.id.getTimestamp().getTime();
        return ca - cb;
      });
      const keep = sorted[0].id;
      const toRemove = sorted.slice(1).map(x => x.id);
      if (toRemove.length) {
        const delRes = await db.collection('users').deleteMany({ _id: { $in: toRemove } });
        removed += delRes.deletedCount || 0;
      }
      console.log(`• Username '${g._id}': kept ${keep}, removed ${toRemove.length}`);
    }
    console.log(`✅ Removed ${removed} duplicate user documents`);

    // Recreate unique index on username
    console.log('🔧 Creating unique index on username...');
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    console.log('✅ Unique index on username created');

    // List current indexes
    console.log('📋 Current indexes:');
    const indexes = await db.collection('users').indexes();
    indexes.forEach(index => {
      console.log(`  - ${JSON.stringify(index.key)} (${index.name})`);
    });

    console.log('🎉 Database cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

fixDatabase();
