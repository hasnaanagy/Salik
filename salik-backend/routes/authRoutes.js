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
router.post(
  "/create-admin",
  verifyToken,
  adminMiddleware,
  authController.createAdmin
);
router.get(
  "/unverified-documents",
  verifyToken,
  adminMiddleware,
  authController.getUnverifiedDocuments
);
router.post(
  "/verify-document",
  verifyToken,
  adminMiddleware,
  authController.verifyDocument
); // Unified endpoint

// Update user with Cloudinary URLs
router.patch("/", verifyToken, async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const updatedData = { ...req.body };

    // Process Cloudinary URLs directly from FormData
    if (req.body.nationalIdImage) {
      updatedData.nationalIdImage = req.body.nationalIdImage;
      updatedData.nationalIdStatus = "pending"; // Set to pending on upload
    }
    if (req.body.licenseImage) {
      updatedData.licenseImage = req.body.licenseImage;
      updatedData.licenseStatus = "pending"; // Set to pending on upload
    }
    if (req.body.profileImg) {
      updatedData.profileImg = req.body.profileImg;
    }

    req.body = updatedData;
    await authController.updateUser(req, res);
  } catch (error) {
    console.error("Error processing user update:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

module.exports = router;
