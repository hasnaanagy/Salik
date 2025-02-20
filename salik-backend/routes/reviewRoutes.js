const express = require("express");
const { addReview } = require("../controllers/reviewController");
const { getProviderReviews } = require("../controllers/reviewController");
const { updateReview } = require("../controllers/reviewController");
const { deleteReview } = require("../controllers/reviewController");

const { verifyToken } = require("../middleware/authMiddleware"); // Middleware to authenticate user
const router = express.Router();

// Route to add a review
router.post("/:id", verifyToken, addReview);
// Route to fetch reviews for a provider

router.get("/:providerId", getProviderReviews);

router.put("/:id", verifyToken, updateReview);

router.delete("/:id", verifyToken, deleteReview);
module.exports = router;
