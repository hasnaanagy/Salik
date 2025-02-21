const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware"); // Import verifyToken middleware
const upload = require("../middleware/multerConfig"); // Import Multer config
const router = express.Router();

// Signup route
router.post("/signup", authController.signup);

// Login route
router.post("/login", authController.login);

// Role switching route
router.put("/switch-role", verifyToken, authController.switchRole);

// Get user by ID
router.get("/", verifyToken, authController.getUserById);

// Update user profile with image upload
router.patch(
    "/",
    verifyToken,
    upload.fields([
        { name: "profileImg", maxCount: 1 },
        { name: "nationalIdImage", maxCount: 1 },
        { name: "licenseImage", maxCount: 1 }
    ]),
    authController.updateUser
);

module.exports = router;
