const  express = require('express');
const router = express.Router();
const { postABook, getAllBooks, getSingleBook, UpdateBook, DeleteABook, searchBooks, getTopBooks, getRecommendedBooks, getCategories } = require("./book.controller");
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// public
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/top', getTopBooks);
router.get('/recommended', getRecommendedBooks);
router.get('/categories', getCategories);
router.get('/:id', getSingleBook);

// admin protected
router.post('/create-book', verifyToken, verifyAdmin, postABook);
router.put('/edit/:id', verifyToken, verifyAdmin, UpdateBook);
router.delete('/delete/:id', verifyToken, verifyAdmin, DeleteABook);


module.exports = router;