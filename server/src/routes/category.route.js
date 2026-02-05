const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.get("/", categoryController.getCategories);

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  categoryController.createCategory,
);

router.patch(
  "/:id/toggle",
  authenticate,
  authorizeAdmin,
  categoryController.toggleCategory,
);

module.exports = router;
