const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.put("/switch-role", verifyToken, authController.switchRole);
router.get("/", verifyToken, authController.getUserById);

// Admin-only routes
router.post("/create-admin", verifyToken, adminMiddleware, authController.createAdmin);
router.get("/unverified-documents", verifyToken, adminMiddleware, authController.getUnverifiedDocuments);
router.post("/verify-document", verifyToken, adminMiddleware, authController.verifyDocument);
router.get("/users", verifyToken, adminMiddleware, authController.getFilteredUsers);

// Update user with Cloudinary URLs
router.patch("/", verifyToken, authController.updateUser);

// Add the delete user route (admin only)
router.delete("/users/:userId", verifyToken, adminMiddleware, authController.deleteUser);

module.exports = router;