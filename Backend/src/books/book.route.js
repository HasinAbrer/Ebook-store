const  express = require('express');
const router = express.Router();

const Book = require("./book.model");

router.post("/create-book", async (req, res) => {
  try {
    const newBook = new Book({ ...req.body }); // ✅ use 'new' here
    await newBook.save();
    res.status(200).send({ message: "Book posted successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book", error);
    res.status(500).send({ message: "Failed to create book", error });
  }
});


module.exports = router;