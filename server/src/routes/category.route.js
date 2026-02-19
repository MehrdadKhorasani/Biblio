const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authenticate = require("../middlewares/authenticate.middleware");
const { authorize, ROLES } = require("../middlewares/authorize.middleware");

router.get("/", categoryController.getCategoriesWithBookCount);

router.post(
  "/",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  categoryController.createCategory,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  categoryController.toggleCategory,
);

router.get(
  "/all",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  categoryController.getCategoriesWithBookCount,
);

router.put(
  "/:id",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  categoryController.updateCategory,
);

module.exports = router;
