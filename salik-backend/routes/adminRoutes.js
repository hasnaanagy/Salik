// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/dashboard-stats", verifyToken, getDashboardStats);

module.exports = router;