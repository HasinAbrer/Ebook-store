const Book = require("./book.model");

const postABook= async (req, res) => {
  try {
    const newBook = new Book({ ...req.body }); // ✅ use 'new' here
    await newBook.save();
    res.status(200).send({ message: "Book posted successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book", error);
    res.status(500).send({ message: "Failed to create book", error });
  }
}

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send({ message: "Books fetched successfully", books });
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send({ message: "Failed to fetch books", error });
  }
}

module.exports = {
  postABook,
  getAllBooks
};