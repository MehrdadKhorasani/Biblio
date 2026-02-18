const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.get(
  "/admin",
  authenticate,
  authorizeAdmin,
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
  authorizeAdmin,
  orderController.updateOrderStatus,
);

router.get(
  "/:id/history",
  authenticate,
  authorizeAdmin,
  orderController.getOrderStatusHistory,
);

router.get(
  "/user/:id",
  authenticate,
  authorizeAdmin,
  orderController.getOrdersByUserId,
);

module.exports = router;
