const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authenticate = require("../middlewares/authenticate.middleware");
const { authorize, ROLES } = require("../middlewares/authorize.middleware");

router.get(
  "/admin",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  orderController.getAdminOrders,
);

router.get("/my", authenticate, orderController.getUserOrders);
router.get("/:id", authenticate, orderController.getOrderById);
router.post("/", authenticate, orderController.createOrder);
router.patch("/:id/cancel", authenticate, orderController.cancelOrder);
router.post("/:id/pay", authenticate, orderController.payOrder);

router.patch(
  "/:id/status",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  orderController.updateOrderStatus,
);

router.get(
  "/:id/history",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  orderController.getOrderStatusHistory,
);

router.get(
  "/user/:id",
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  orderController.getOrdersByUserId,
);

module.exports = router;
