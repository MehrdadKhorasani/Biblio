const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book.controller");
const authenticate = require("../middlewares/authenticate.middleware");
const { authorize, ROLES } = require("../middlewares/authorize.middleware");
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
router.post(
  "/",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  bookController.createBook,
);
router.patch(
  "/:id",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  bookController.updateBook,
);

router.patch(
  "/:id/availability",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  bookController.toggleBookAvailability,
);

router.patch(
  "/:id/stock",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  bookController.updateBookStock,
);

router.get(
  "/:id/stock-history",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  bookController.getBookStockHistory,
);

router.delete(
  "/:id",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  bookController.softDeleteBook,
);

router.patch(
  "/:id/restore",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  bookController.restoreBook,
);

module.exports = router;
