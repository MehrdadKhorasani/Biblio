const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate.middleware");
const { authorize, ROLES } = require("../middlewares/authorize.middleware");

const {
  getUserActivityReport,
  getOrderStatusReport,
  getBookStockReport,
} = require("../controllers/report.controller");

router.get(
  "/order-status",
  authenticate,
  authorize([ROLES.MANAGER]),
  getOrderStatusReport,
);

router.get(
  "/book-stock",
  authenticate,
  authorize([ROLES.MANAGER]),
  getBookStockReport,
);

router.get(
  "/user-activities",
  authenticate,
  authorize([ROLES.MANAGER]),
  getUserActivityReport,
);

module.exports = router;
