const ServiceReview = require("../models/ServiceReview");
const Service = require("../models/Service");
const User = require("../models/User");

// Add a review to a service
exports.addServiceReview = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { rating, comment } = req.body;
    const customerId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating is required and must be between 1 and 5",
      });
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if user is a customer
    const user = await User.findById(customerId);
    if (!user || user.type !== "customer") {
      return res.status(403).json({
        message: "Only customers can review services",
      });
    }

    // Check if user has already reviewed this service
    const existingReview = await ServiceReview.findOne({
      serviceId,
      customerId,
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment || "";
      await existingReview.save();

      // Recalculate service average rating
      await updateServiceRating(serviceId);

      return res.status(200).json({
        message: "Review updated successfully",
        review: existingReview,
      });
    }

    // Create new review
    const newReview = new ServiceReview({
      serviceId,
      customerId,
      rating,
      comment: comment || "",
    });

    await newReview.save();

    // Update service average rating
    await updateServiceRating(serviceId);

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      message: "Error adding review",
      error: error.message,
    });
  }
};

// Get all reviews for a service
exports.getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Get reviews with customer details
    const reviews = await ServiceReview.find({ serviceId })
      .populate("customerId", "fullName profileImg")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Reviews retrieved successfully",
      reviews,
      averageRating: service.averageRating,
      totalReviews: service.totalReviews,
    });
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({
      message: "Error getting reviews",
      error: error.message,
    });
  }
};

// Delete a review
exports.deleteServiceReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const customerId = req.user._id;

    const review = await ServiceReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is the review owner
    if (review.customerId.toString() !== customerId.toString()) {
      return res.status(403).json({
        message: "You can only delete your own reviews",
      });
    }

    const serviceId = review.serviceId;

    // Delete the review
    await ServiceReview.deleteOne({ _id: reviewId });

    // Update service average rating
    await updateServiceRating(serviceId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      message: "Error deleting review",
      error: error.message,
    });
  }
};

// Helper function to update service average rating
async function updateServiceRating(serviceId) {
  try {
    const reviews = await ServiceReview.find({ serviceId });

    if (reviews.length === 0) {
      // No reviews, reset rating
      await Service.findByIdAndUpdate(serviceId, {
        averageRating: 0,
        totalReviews: 0,
      });
      return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update service with new rating data
    await Service.findByIdAndUpdate(serviceId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Error updating service rating:", error);
    throw error;
  }
}
