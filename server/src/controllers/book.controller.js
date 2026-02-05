const Book = require("../models/book.model");
const BookStockLog = require("../models/bookStockLog.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");

const ROLES = {
  USER: 1,
  ADMIN: 2,
  MANAGER: 3,
};

const getAllBooks = async (req, res) => {
  try {
    let books = await Book.findAll();

    if (req.user && req.user.roleId === ROLES.USER) {
      books = books.filter((b) => b.isAvailable === true && b.stock > 0);
    }

    res.status(200).json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (
      req.user.roleId === ROLES.USER &&
      (!book.isAvailable || book.stock <= 0)
    ) {
      return res.status(403).json({
        message: "This book is not available",
      });
    }

    res.status(200).json({ book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      translator,
      publisher,
      description,
      ISBN,
      price,
      stock,
      coverImage,
      categoryId,
    } = req.body;

    if (
      !title ||
      !author ||
      !publisher ||
      price == null ||
      stock == null ||
      !categoryId
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const category = await Category.findById(categoryId);
    if (!category || !category.isActive) {
      return res.status(400).json({
        message: "Invalid or inactive category",
      });
    }

    const book = await Book.create({
      title,
      author,
      translator,
      publisher,
      description,
      ISBN,
      price,
      stock,
      coverImage,
      categoryId,
    });

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedBook = await Book.updateById(bookId, req.body);

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const toggleBookAvailability = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedBook = await Book.updateAvailability(
      bookId,
      !book.isAvailable,
    );

    res.status(200).json({
      message: "Book availability updated",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error toggling availability:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateBookStock = async () => {
  try {
    const bookId = parseInt(req.params.id);
    const { amount, note } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ message: "amount (number) is required:" });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const oldStock = book.stock;
    const newStock = oldStock + amount;

    if (newStock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    const updatedBook = await Book.updateStock(bookId, newStock);

    await BOOKStockLog.create({
      bookId,
      actorId: req.user.id,
      action: amount > 0 ? "INCREASE_STOCK" : "DECREASE_STOCK",
      oldStock,
      newStock,
      note,
    });

    res.status(200).json({
      message: "Stock updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBookStockHistory = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const logs = await BookStockLog.findByBookId(bookId);

    res.status(200).json({
      book: {
        id: book.id,
        title: book.title,
      },
      logs,
    });
  } catch (error) {
    console.error("Error fetching book stock history:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  toggleBookAvailability,
  getBookStockHistory,
  updateBookStock,
};
