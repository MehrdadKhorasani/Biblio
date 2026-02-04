const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

//router.get("/", authenticate, orderController.getAllOrders);
router.get("/user", authenticate, orderController.getUserOrders);
router.post("/", authenticate, orderController.createOrder);
router.post("/:id/cancel", authenticate, orderController.cancelOrder);
router.post("/:id/pay", authenticate, orderController.payOrder);

router.get(
  "/admin",
  authenticate,
  authorizeAdmin,
  orderController.getAdminOrders,
);

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

module.exports = router;
