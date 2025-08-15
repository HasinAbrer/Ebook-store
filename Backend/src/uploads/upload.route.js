const express = require('express');
const crypto = require('crypto');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// POST /api/uploads/sign
// Body: { folder?: string }
// Returns: { timestamp, signature, apiKey, cloudName, folder }
router.post('/sign', verifyToken, (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [
        !cloudName ? 'CLOUDINARY_CLOUD_NAME' : null,
        !apiKey ? 'CLOUDINARY_API_KEY' : null,
        !apiSecret ? 'CLOUDINARY_API_SECRET' : null,
      ].filter(Boolean);
      return res.status(500).json({ message: `Cloudinary env vars are not set: ${missing.join(', ')}` });
    }

    const folder = req.body?.folder || 'ebook-store/messages';
    const timestamp = Math.floor(Date.now() / 1000);

    // Create the string to sign per Cloudinary rules
    // Example: `folder=<folder>&timestamp=<timestamp><apiSecret>`
    const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    return res.json({ timestamp, signature, apiKey, cloudName, folder });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to create signature' });
  }
});

module.exports = router;
