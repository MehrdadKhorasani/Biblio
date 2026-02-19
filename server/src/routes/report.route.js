const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate.middleware");
const { authorize, ROLES } = require("../middlewares/authorize.middleware");

const { getOrderStatusReport } = require("../controllers/report.controller");

router.get(
  "/order-status",
  authenticate,
  authorize([ROLES.MANAGER]),
  getOrderStatusReport,
);

module.exports = router;
