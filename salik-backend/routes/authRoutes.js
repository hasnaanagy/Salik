// authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware"); // Import the verifyToken middleware
const router = express.Router();

// Signup route
router.post("/signup", authController.signup);

// Login route
router.post("/login", authController.login);

// Role switching route (using the verifyToken middleware)
router.put("/switch-role", verifyToken, authController.switchRole);

//get by id
router.get("/", verifyToken, authController.getUserById);

//Update
router.patch("/", verifyToken, authController.updateUser);

module.exports = router;
