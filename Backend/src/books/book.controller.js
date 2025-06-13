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
    const books = await Book.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.status(200).send({ message: "Books fetched successfully", books });
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send({ message: "Failed to fetch books", error });
  }
}

const getSingleBook = async (req, res) => {
  try {
    const {id} = req.params;
    const book = await Book.findById(id);
    if (!book) {
      res.status(404).send({ message: "Book not found" });
    }
    res.status(200).send(book);
  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).send({ message: "Failed to fetch book"});
  }
}

const UpdateBook= async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).send({ message: "Book not found" });
    }
    res.status(200).send({
        message: "Book updated successfully",
         book: updatedBook
        })
  } catch (error) {
    console.error("Error updating book", error);
    res.status(500).send({ message: "Failed to update book", error });
  }
}

const DeleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).send({ message: "Book not found" });
    }
    res.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book", error);
    res.status(500).send({ message: "Failed to delete book", error });
  }
}




module.exports = {
  postABook,
  getAllBooks,
  getSingleBook,
  UpdateBook,
  DeleteABook
};