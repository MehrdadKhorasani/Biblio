const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/dashboard.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.get("/stats", authenticate, authorizeAdmin, getAdminStats);

module.exports = router;
