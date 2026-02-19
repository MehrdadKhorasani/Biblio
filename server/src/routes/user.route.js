const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate.middleware");
const { authorize, ROLES } = require("../middlewares/authorize.middleware");

/* ======================
   ADMIN ROUTES
====================== */

router.get(
  "/admin/users",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  userController.getAllUsersForAdmin,
);

router.patch(
  "/admin/users/:id/status",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  userController.toggleUserStatus,
);

/* ======================
   MANAGER ROUTES
====================== */

router.get(
  "/manager/users",
  authenticate,
  authorize([ROLES.MANAGER]),
  userController.getAllUsersForManager,
);

router.patch(
  "/manager/users/:id/role",
  authenticate,
  authorize([ROLES.MANAGER]),
  userController.changeUserRole,
);

router.patch(
  "/manager/users/:id/active",
  authenticate,
  authorize([ROLES.MANAGER]),
  userController.toggleUserActive,
);

router.patch(
  "/manager/users/:id/password",
  authenticate,
  authorize([ROLES.MANAGER]),
  userController.resetUserPassword,
);

router.get(
  "/manager/user-logs",
  authenticate,
  authorize([ROLES.MANAGER]),
  userController.getUserActivityLogs,
);

/* ======================
   COMMON (Authenticated)
====================== */

router.get("/me", authenticate, userController.getMyProfile);

router.patch("/me", authenticate, userController.updateMyProfile);

router.patch("/me/password", authenticate, userController.changeMyPassword);

module.exports = router;
