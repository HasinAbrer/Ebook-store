const express =  require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUserById } = require('./user.controller');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const router =  express.Router();

// Utility to escape regex special chars
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



// Admin-only: list users (without sensitive info)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    return res.json({ users });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Token validation for any authenticated user
router.get('/validate', verifyToken, async (req, res) => {
  return res.sendStatus(200);
});

// Return current user profile (id, username, role) for any authenticated user
router.get('/me', verifyToken, async (req, res) => {
  try {
    // req.user is set by verifyToken
    return res.status(200).json({ user: req.user });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch current user' });
  }
});

// DEBUG: list indexes on users collection (do not expose in production)
router.get('/indexes', async (req, res) => {
  try {
    const indexes = await User.collection.indexes();
    return res.json(indexes);
  } catch (e) {
    console.error('Indexes fetch error:', e?.message || e);
    return res.status(500).json({ message: 'Failed to fetch indexes', error: e?.message });
  }
});

// DEBUG: check users matching a username (case-insensitive)
router.get('/debug/:username', async (req, res) => {
  try {
    const raw = req.params.username || '';
    const username = raw.trim();
    const users = await User.find(
      { username: { $regex: `^${escapeRegex(username)}$`, $options: 'i' } },
      { username: 1 }
    ).lean();
    return res.json({ query: username, count: users.length, users });
  } catch (e) {
    console.error('Debug username lookup error:', e?.message || e);
    return res.status(500).json({ message: 'Debug lookup failed', error: e?.message });
  }
});

router.get('/:id', getUserById);

router.post("/admin", async (req, res) => {
    let {username, password} = req.body;
    username = typeof username === 'string' ? username.trim().toLowerCase() : '';
    try {
        // Case-insensitive lookup to support legacy mixed-case usernames
    const admin =  await User.findOne({ username: { $regex: `^${escapeRegex(username)}$`, $options: 'i' } });
        if(!admin) {
            return res.status(404).send({message: "Admin not found!"})
        }
        if(admin.role !== 'admin') {
            return res.status(403).send({message: "Forbidden: Not an admin user"})
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) {
            return res.status(401).send({message: "Invalid password!"})
        }

        const token =  jwt.sign(
            {id: admin._id, username: admin.username, role: admin.role},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                role: admin.role
            }
        })

    } catch (error) {
       console.error("Failed to login as admin", error)
       res.status(401).send({message: "Failed to login as admin"})
    }
})

// User registration (role = user)
router.post('/register', async (req, res) => {
  try {
    let { username, password } = req.body;
    username = typeof username === 'string' ? username.trim().toLowerCase() : '';
    password = typeof password === 'string' ? password : '';
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }
    if (!process.env.JWT_SECRET) {
      console.error('Register error: JWT_SECRET is not set');
      return res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
    }
    // Attempt create directly; rely on unique index for race-safe duplicate detection
    const user = await User.create({ username, password, role: 'user' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).json({
      message: 'User registered',
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    if (err && err.code === 11000) {
      // Provide more context to debug duplicate source
      const key = err.keyValue || {};
      return res.status(409).json({ message: 'Username already exists', key });
    }
    console.error('Register error', err?.message || err);
    return res.status(500).json({ message: 'Registration failed', error: err?.message });
  }
});

// User login (user or admin)
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    username = typeof username === 'string' ? username.trim().toLowerCase() : '';
    password = typeof password === 'string' ? password : '';
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }
    // Case-insensitive lookup to match legacy users saved with different casing
    const user = await User.findOne({ username: { $regex: `^${escapeRegex(username)}$`, $options: 'i' } });
    if (!user) {
      console.warn('Login user not found (ci):', username);
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    if (!process.env.JWT_SECRET) {
      console.error('Login error: JWT_SECRET is not set');
      return res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
    }
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error('Login error', err?.message || err);
    return res.status(500).json({ message: 'Login failed', error: err?.message });
  }
});

// Admin bootstrap register: if no admin exists, allow open creation once; otherwise require admin token
router.post('/admin/register', async (req, res, next) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      // require existing admin for subsequent admin creation
      return verifyToken(req, res, () => verifyAdmin(req, res, () => next()));
    }
    return next();
  } catch (e) {
    return res.status(500).json({ message: 'Failed to check admin state' });
  }
}, async (req, res) => {
  try {
    let { username, password } = req.body;
    username = typeof username === 'string' ? username.trim().toLowerCase() : '';
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }
    // Case-insensitive existence check to prevent duplicates with different casing
    const exists = await User.findOne({ username: { $regex: `^${escapeRegex(username)}$`, $options: 'i' } });
    if (exists) return res.status(409).json({ message: 'Username already exists' });
    const admin = await User.create({ username, password, role: 'admin' });
    const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).json({
      message: 'Admin created',
      token,
      user: { id: admin._id, username: admin.username, role: admin.role },
    });
  } catch (err) {
    console.error('Admin register error', err);
    return res.status(500).json({ message: 'Admin registration failed' });
  }
});

module.exports = router;