const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate.middleware");
const { authorize, ROLES } = require("../middlewares/authorize.middleware");

const {
  getUserActivityReport,
  getOrderStatusReport,
  getBookStockReport,
} = require("../controllers/report.controller");

const {
  getSalesSummary,
  getDailySales,
} = require("../controllers/salesReport.controller");

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

router.get(
  "/sales/summary",
  authenticate,
  authorize([ROLES.MANAGER]),
  getSalesSummary,
);

router.get(
  "/sales/daily",
  authenticate,
  authorize([ROLES.MANAGER]),
  getDailySales,
);

module.exports = router;
