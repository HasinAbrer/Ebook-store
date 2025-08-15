const express = require('express');
const Message = require('./message.model');
const User = require('../users/user.model');
const mongoose = require('mongoose');
const Profile = require('../users/profile.model');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

// Disable unauthenticated messaging: require login

// Authenticated user: create or reuse a single thread with admin
router.post('/auth', verifyToken, async (req, res) => {
  try {
    const { content, imageUrl } = req.body || {};
    if (!content && !imageUrl) {
      return res.status(400).json({ message: 'content or imageUrl is required' });
    }

    // Find existing thread for this user (any status)
    let thread = await Message.findOne({ userId: req.user.id }).sort({ createdAt: -1 });

// Admin: delete conversations for duplicate usernames sharing the same email
router.delete('/admin/cleanup-duplicates', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Load all messages and users to map email by userId
    const messages = await Message.find({}).lean();
    const ids = [...new Set(messages.map(m => String(m.userId)).filter(Boolean))];
    const users = await User.find({ _id: { $in: ids } }, { email: 1 }).lean();
    const userById = new Map(users.map(u => [String(u._id), u]));

    // Group userIds by email
    const byEmail = new Map();
    for (const u of users) {
      const email = (u.email || '').toLowerCase();
      if (!email) continue;
      if (!byEmail.has(email)) byEmail.set(email, []);
      byEmail.get(email).push(String(u._id));
    }

    let deleted = 0;
    for (const [email, uids] of byEmail.entries()) {
      if (uids.length <= 1) continue;
      // Keep the first userId as canonical, delete others' threads
      const [keepId, ...removeIds] = uids;
      const resDel = await Message.deleteMany({ userId: { $in: removeIds } });
      deleted += resDel.deletedCount || 0;
    }

    return res.json({ message: 'Duplicate conversations cleaned', deletedCount: deleted });
  } catch (e) {
    console.error('Cleanup duplicates error:', e);
    return res.status(500).json({ message: 'Failed to cleanup duplicates' });
  }
});

// Admin: purge all conversations (destructive)
router.delete('/admin/purge', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await Message.deleteMany({});
    return res.json({ message: 'All conversations deleted', deletedCount: result.deletedCount });
  } catch (e) {
    console.error('Purge messages error:', e);
    return res.status(500).json({ message: 'Failed to purge conversations' });
  }
});

    if (thread) {
      // Reopen if closed
      if (thread.status === 'closed') thread.status = 'open';
      // Append as a user reply to keep a single thread
      thread.replies.push({ senderRole: 'user', content: content || '', imageUrl });
      await thread.save();
      return res.status(200).json({ message: 'Appended to existing thread', data: thread });
    }

    // No thread yet: create a new one with default subject
    const created = await Message.create({ userId: req.user.id, content, imageUrl });
    return res.status(201).json({ message: 'Thread created', data: created });
  } catch (e) {
    console.error('Create message error', e);
    return res.status(500).json({ message: 'Failed to create or append to message', error: e?.message });
  }
});

// User: my messages
router.get('/my', verifyToken, async (req, res) => {
  try {
    const msgs = await Message.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // Hydrate admin profile so the user can see admin avatar in chat
    const adminUser = await User.findOne({ role: 'admin' }, { _id: 1 }).lean();
    let adminProfile = null;
    if (adminUser && adminUser._id) {
      const prof = await Profile.findOne({ userId: adminUser._id }, { photoUrl: 1, displayName: 1 }).lean();
      if (prof) {
        adminProfile = { photoUrl: prof.photoUrl || null, displayName: prof.displayName || 'Admin' };
      } else {
        adminProfile = { photoUrl: null, displayName: 'Admin' };
      }
    }

    return res.json({ messages: msgs, adminProfile });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Admin: list all messages
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
    const ids = messages
      .map((m) => m.userId)
      .filter((id) => typeof id === 'string' || (typeof id === 'object' && id))
      .map((id) => (typeof id === 'object' ? String(id) : String(id)))
      .filter((s) => mongoose.Types.ObjectId.isValid(s));

    const uniqueIds = [...new Set(ids)];
    const users = await User.find({ _id: { $in: uniqueIds } }, { username: 1, role: 1, email: 1 }).lean();
    const userMap = new Map(
      users.map((u) => [String(u._id), { _id: u._id, username: u.username, role: u.role, email: u.email }])
    );

    // Attach user profile (photoUrl, displayName) for admin UI avatars
    const profiles = await Profile.find({ userId: { $in: uniqueIds } }, { userId: 1, photoUrl: 1, displayName: 1 }).lean();
    const profileMap = new Map(profiles.map((p) => [String(p.userId), { photoUrl: p.photoUrl || null, displayName: p.displayName || null }]));

    const hydrated = messages.map((m) => {
      const key = mongoose.Types.ObjectId.isValid(String(m.userId)) ? String(m.userId) : null;
      const u = key ? userMap.get(key) : null;
      const userProfile = key ? (profileMap.get(key) || null) : null;
      if (u) {
        return { ...m, userId: u, userProfile };
      }
      return { ...m, userProfile };
    });

    return res.json({ messages: hydrated });
  } catch (e) {
    console.error('Failed to fetch messages:', e);
    return res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Reply to a message (admin or owner user)
router.post('/:id/reply', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, imageUrl } = req.body;
    if (!content && !imageUrl) return res.status(400).json({ message: 'content or imageUrl is required' });
    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ message: 'Not found' });
    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin && String(msg.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    msg.replies.push({ senderRole: isAdmin ? 'admin' : 'user', content: content || '', imageUrl });
    await msg.save();
    return res.json({ message: 'Replied', data: msg });
  } catch (e) {
    console.error('Reply error:', e);
    return res.status(500).json({ message: 'Failed to reply', error: e?.message });
  }
});

// Admin: close a message
router.post('/:id/close', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ message: 'Not found' });
    msg.status = 'closed';
    await msg.save();
    return res.json({ message: 'Closed', data: msg });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to close' });
  }
});

module.exports = router;
