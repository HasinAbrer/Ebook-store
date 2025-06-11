const  express = require('express');
const router = express.Router();
const { postABook } = require("./book.controller");
const { getAllBooks } = require("./book.controller");
const { getSingleBook } = require("./book.controller");
const { UpdateBook } = require("./book.controller");
const { DeleteABook } = require("./book.controller");

const Book = require("./book.model");

router.post("/create-book", postABook);

router.get("/",getAllBooks);

router.get("/:id",getSingleBook);

router.put("/edit/:id",UpdateBook);

router.delete("/delete/:id",DeleteABook);


module.exports = router;