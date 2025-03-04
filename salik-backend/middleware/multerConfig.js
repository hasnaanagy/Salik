const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig"); // Import Cloudinary config

// Configure Multer Storage to Upload Directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_images", // Cloudinary folder name
    format: async (req, file) => "png", // Convert all images to PNG format
    public_id: (req, file) => Date.now() + "-" + file.originalname.replace(/\s+/g, "_"), // Rename file
  },
});

// File Filter to accept images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Initialize Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
