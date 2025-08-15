const Profile = require('./profile.model');

// GET /api/profile/:email
const getProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const profile = await Profile.findOne({ email });
    return res.status(200).json(profile || null);
  } catch (e) {
    console.error('Failed to get profile', e);
    return res.status(500).json({ message: 'Failed to get profile' });
  }
};

// PUT /api/profile/:email (upsert)
const upsertProfile = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const update = { ...req.body, email };
    const saved = await Profile.findOneAndUpdate({ email }, update, { new: true, upsert: true });
    return res.status(200).json(saved);
  } catch (e) {
    console.error('Failed to upsert profile', e);
    return res.status(500).json({ message: 'Failed to save profile' });
  }
};

// GET /api/profile/me (token-based)
// Important: strictly scoped to the authenticated account by (userId, accountType) to avoid cross-over
const getMyProfile = async (req, res) => {
  try {
    const { id, role } = req.user || {};
    if (!id) return res.status(401).json({ message: 'Unauthorized' });
    const accountType = role === 'admin' ? 'admin' : 'user';
    let profile = await Profile.findOne({ userId: id, accountType });
    // Fallback for legacy docs missing accountType; do not mutate here
    if (!profile) {
      profile = await Profile.findOne({ userId: id, accountType: { $exists: false } });
    }
    return res.status(200).json(profile || null);
  } catch (e) {
    console.error('Failed to get my profile', e);
    return res.status(500).json({ message: 'Failed to get profile' });
  }
};

// PUT /api/profile/me (token-based upsert)
// Important: Only operate on the caller's (userId, accountType). Do NOT consolidate by email/username
const upsertMyProfile = async (req, res) => {
  try {
    const { id, username, email, role } = req.user || {};
    if (!id) return res.status(401).json({ message: 'Unauthorized' });

    const accountType = role === 'admin' ? 'admin' : 'user';
    const baseUpdate = { ...req.body, userId: id, accountType };
    if (username) baseUpdate.username = username;
    // It's fine to store email for convenience, but do not use it to merge profiles across users
    if (email) baseUpdate.email = email;

    // Look up by (userId, accountType)
    let current = await Profile.findOne({ userId: id, accountType });
    // Migrate legacy profile missing accountType for this userId if present
    if (!current) {
      current = await Profile.findOne({ userId: id, accountType: { $exists: false } });
      if (current) {
        try {
          await Profile.updateOne({ _id: current._id }, { $set: { accountType } });
          current.accountType = accountType;
        } catch (_) {
          // ignore, will handle via duplicate key handling below if any
        }
      }
    }

    let saved;
    try {
      if (current) {
        saved = await Profile.findByIdAndUpdate(current._id, baseUpdate, { new: true });
      } else {
        saved = await Profile.create(baseUpdate);
      }
    } catch (e) {
      // If there's a legacy unique index on email or (userId) unique, drop and recreate compound index, then retry once
      if (e && e.code === 11000) {
        try {
          const coll = Profile.collection;
          const indexes = await coll.indexes();
          const emailIndex = indexes.find(ix => ix.key && ix.key.email === 1 && ix.unique);
          if (emailIndex) await coll.dropIndex(emailIndex.name);
          const userUnique = indexes.find(ix => ix.key && ix.key.userId === 1 && ix.unique);
          if (userUnique) await coll.dropIndex(userUnique.name);
          // Ensure compound index exists (safe if already exists)
          await coll.createIndex({ userId: 1, accountType: 1 }, { unique: true, sparse: true });
        } catch (_) {}
        // Retry strictly by (userId, accountType)
        current = await Profile.findOne({ userId: id, accountType });
        if (current) {
          saved = await Profile.findByIdAndUpdate(current._id, baseUpdate, { new: true });
        } else {
          saved = await Profile.create(baseUpdate);
        }
      } else {
        throw e;
      }
    }
    return res.status(200).json(saved);
  } catch (e) {
    console.error('Failed to upsert my profile', e);
    if (e && e.code === 11000) {
      return res.status(409).json({ message: 'Profile conflict (duplicate key). Please try again.' });
    }
    return res.status(500).json({ message: 'Failed to save profile' });
  }
};

module.exports = { getProfileByEmail, upsertProfile, getMyProfile, upsertMyProfile };
