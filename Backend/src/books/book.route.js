const  express = require('express');
const router = express.Router();
const { postABook } = require("./book.controller");
const { getAllBooks } = require("./book.controller");
const { getSingleBook } = require("./book.controller");
const { UpdateBook } = require("./book.controller");
const { DeleteABook } = require("./book.controller");

const Book = require("./book.model");
const { verify } = require('jsonwebtoken');

router.post("/create-book",verify, postABook);

router.get("/",getAllBooks);

router.get("/:id",getSingleBook);

router.put("/edit/:id",verify, UpdateBook);

router.delete("/delete/:id",verify, DeleteABook);


module.exports = router;