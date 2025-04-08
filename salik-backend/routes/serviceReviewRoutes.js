const express = require("express");
const router = express.Router();
const serviceReviewController = require("../controllers/serviceReviewController");
const { verifyToken } = require("../middleware/authMiddleware");

// Add a review to a service (requires authentication)
router.post(
  "/:serviceId",
  verifyToken,
  serviceReviewController.addServiceReview
);

// Get all reviews for a service (public)
router.get("/:serviceId", serviceReviewController.getServiceReviews);

// Delete a review (requires authentication)
router.delete(
  "/:reviewId",
  verifyToken,
  serviceReviewController.deleteServiceReview
);

module.exports = router;
