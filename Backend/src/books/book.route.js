const  express = require('express');
const router = express.Router();
const { postABook } = require("./book.controller");
const { getAllBooks } = require("./book.controller");

const Book = require("./book.model");

router.post("/create-book", postABook);

router.get("/",getAllBooks);


module.exports = router;