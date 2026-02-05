const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.get("/", authenticate, bookController.getAllBooks);
router.get("/:id", authenticate, bookController.getBookById);

router.post("/", authenticate, authorizeAdmin, bookController.createBook);
router.patch("/:id", authenticate, authorizeAdmin, bookController.updateBook);
router.patch(
  "/:id/toggle",
  authenticate,
  authorizeAdmin,
  bookController.toggleBookAvailability,
);

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

module.exports = router;
