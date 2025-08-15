const express = require('express');
const Review = require('./review.model');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

// Create or update a review by the same user for a book
router.post('/', verifyToken, async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    if (!bookId || !rating) return res.status(400).json({ message: 'bookId and rating are required' });

    const existing = await Review.findOne({ bookId, userId: req.user.id });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment ?? existing.comment;
      await existing.save();
      return res.json({ message: 'Review updated', review: existing });
    }

    const review = await Review.create({ bookId, userId: req.user.id, rating, comment });
    return res.status(201).json({ message: 'Review created', review });
  } catch (e) {
    console.error('Create review error', e);
    return res.status(500).json({ message: 'Failed to create review' });
  }
});

// List reviews for a book
router.get('/book/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ bookId }).sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Get my reviews
router.get('/my', verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch your reviews' });
  }
});

// Delete a review (owner or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    const isOwner = review.userId?.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await Review.findByIdAndDelete(id);
    return res.json({ message: 'Deleted' });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to delete review' });
  }
});

// Admin: Get all reviews
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 }).populate('bookId', 'title');
    return res.json({ reviews });
  } catch (e) {
    console.error('Failed to fetch all reviews:', e);
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

module.exports = router;
