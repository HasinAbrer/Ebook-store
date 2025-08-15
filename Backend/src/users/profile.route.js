const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getProfileByEmail, upsertProfile, getMyProfile, upsertMyProfile } = require('./profile.controller');

// Token-based routes
router.get('/me', verifyToken, getMyProfile);
router.put('/me', verifyToken, upsertMyProfile);

// Legacy email-based routes (kept for backward compatibility)
router.get('/:email', getProfileByEmail);
router.put('/:email', upsertProfile);

module.exports = router;
