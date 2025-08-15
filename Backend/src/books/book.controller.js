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

// GET /api/books/search?query=&category=&minPrice=&maxPrice=&sort=&page=&limit=
const searchBooks = async (req, res) => {
  try {
    const {
      query = '',
      category,
      minPrice,
      maxPrice,
      sort = 'createdAt:desc',
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.newPrice = {};
      if (minPrice) filter.newPrice.$gte = Number(minPrice);
      if (maxPrice) filter.newPrice.$lte = Number(maxPrice);
    }

    const [sortField, sortDir = 'asc'] = String(sort).split(':');
    const sortSpec = { [sortField]: sortDir.toLowerCase() === 'desc' ? -1 : 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Book.find(filter).sort(sortSpec).skip(skip).limit(Number(limit)),
      Book.countDocuments(filter),
    ]);

    return res.status(200).json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error searching books', error);
    return res.status(500).json({ message: 'Failed to search books' });
  }
};

// GET /api/books/top?limit=10
const getTopBooks = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const items = await Book.find().sort({ totalSold: -1, ratingAvg: -1 }).limit(limit);
    return res.status(200).json({ items });
  } catch (e) {
    console.error('Error fetching top books', e);
    return res.status(500).json({ message: 'Failed to fetch top books' });
  }
};

// GET /api/books/recommended?category=&limit=10
const getRecommendedBooks = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await Book.find(filter).sort({ ratingAvg: -1, createdAt: -1 }).limit(limit);
    return res.status(200).json({ items });
  } catch (e) {
    console.error('Error fetching recommended books', e);
    return res.status(500).json({ message: 'Failed to fetch recommended books' });
  }
};

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

// GET /api/books/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    return res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories', error);
    return res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  searchBooks,
  getTopBooks,
  getRecommendedBooks,
  getSingleBook,
  UpdateBook,
  DeleteABook,
  getCategories,
};