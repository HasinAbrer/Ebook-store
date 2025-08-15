const express = require('express');
const router = express.Router();
const { getBooksNews } = require('./newsController');

// GET /api/news/books
router.get('/books', getBooksNews);

module.exports = router;
