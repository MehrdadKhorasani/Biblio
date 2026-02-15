const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Optional authentication middleware
const optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.isActive) {
      req.user = { id: user.id, roleId: user.roleId };
    }
  } catch (err) {
    console.log("Optional auth failed:", err.message);
    // خطا رو نادیده می‌گیریم چون middleware اختیاریه
  }

  next();
};

// --------------------
// Public routes
// --------------------
router.get("/", optionalAuthenticate, bookController.getAllBooks);
router.get("/:id", optionalAuthenticate, bookController.getBookById);

// --------------------
// Admin routes
// --------------------
router.post("/", authenticate, authorizeAdmin, bookController.createBook);
router.patch("/:id", authenticate, authorizeAdmin, bookController.updateBook);

router.patch(
  "/:id/availability",
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

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  bookController.softDeleteBook,
);

router.patch(
  "/:id/restore",
  authenticate,
  authorizeAdmin,
  bookController.restoreBook,
);

module.exports = router;
