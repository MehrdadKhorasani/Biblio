const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");
const authorizeManager = require("../middlewares/authorizeManager");

router.get(
  "/admin/users",
  authenticate,
  authorizeAdmin,
  userController.getAllUsersForAdmin,
);

router.patch(
  "/admin/users/:id/status",
  authenticate,
  authorizeAdmin,
  userController.toggleUserStatus,
);

router.get("/me", authenticate, userController.getMyProfile);
router.patch("/me", authenticate, userController.updateMyProfile);

// Manager:
router.get(
  "/manager/users",
  authenticate,
  authorizeManager,
  userController.getAllUsersForManager,
);

router.patch(
  "/manager/users/:id/role",
  authenticate,
  authorizeManager,
  userController.changeUserRole,
);

router.pathch(
  "/manager/users/:id/active",
  authenticate,
  authorizeManager,
  userController.toggleUserActive,
);

router.patch(
  "/manager/users/:id/password",
  authenticate,
  authorizeManager,
  userController.resetUserPassword,
);

router.get(
  "/manager/user-logs",
  authenticate,
  authorizeManager,
  userController.getUserActivityLogs,
);

module.exports = router;
