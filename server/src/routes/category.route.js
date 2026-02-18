const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.get("/", categoryController.getCategoriesWithBookCount);

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  categoryController.createCategory,
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeAdmin,
  categoryController.toggleCategory,
);

router.get(
  "/all",
  authenticate,
  authorizeAdmin,
  categoryController.getCategoriesWithBookCount,
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  categoryController.updateCategory,
);

module.exports = router;
