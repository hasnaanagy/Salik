const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware"); // Import verifyToken middleware
const upload = require("../middleware/multerConfig"); // Import updated Multer config for Cloudinary
const router = express.Router();

// Signup route
router.post("/signup", authController.signup);

// Login route
router.post("/login", authController.login);

// Role switching route
router.put("/switch-role", verifyToken, authController.switchRole);

// Get user by ID
router.get("/", verifyToken, authController.getUserById);

// Update user profile with image upload to Cloudinary
router.patch(
  "/",
  verifyToken,
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "nationalIdImage", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log("Received files:", req.files);
      console.log("Received body:", req.body);

      // Extract uploaded image URLs from Cloudinary
      const updatedData = { ...req.body };
      if (req.files) {
        if (req.files.profileImg) {
          updatedData.profileImg = req.files.profileImg[0].path; // Cloudinary URL
        }
        if (req.files.nationalIdImage) {
          updatedData.nationalIdImage = req.files.nationalIdImage[0].path;
        }
        if (req.files.licenseImage) {
          updatedData.licenseImage = req.files.licenseImage[0].path;
        }
      }

      // Call the updateUser function with modified data
      req.body = updatedData;
      await authController.updateUser(req, res);
    } catch (error) {
      console.error("Error processing user update:", error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
);

module.exports = router;
