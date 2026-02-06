const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

// Public
router.get("/", authenticate, bookController.getAllBooks);
router.get("/:id", authenticate, bookController.getBookById);

// Managing Books
router.post("/", authenticate, authorizeAdmin, bookController.createBook);
router.patch("/:id", authenticate, authorizeAdmin, bookController.updateBook);

// Availability
router.patch(
  "/:id/availability",
  authenticate,
  authorizeAdmin,
  bookController.toggleBookAvailability,
);

// Stock
router.patch(
  "/:id/stock",
  authenticate,
  authorizeAdmin,
  bookController.updateBookStock,
);

router.get(
  "/:id/stock-history",
  authenticate,
  authorizeAdmin,
  bookController.getBookStockHistory,
);

// Soft delete
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  bookController.softDeleteBook,
);
// Restore
router.patch(
  "/:id/restore",
  authenticate,
  authorizeAdmin,
  bookController.restoreBook,
);

module.exports = router;
