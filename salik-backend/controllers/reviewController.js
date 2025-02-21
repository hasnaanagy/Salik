const Review = require("../models/Review");
const User = require("../models/User");

// Add review controller
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const providerId = req.params.id;
  try {
    // Check if the provider exists and is of type "provider"
    const provider = await User.findById(providerId);
    if (!provider || provider.type !== "provider") {
      return res.status(400).json({ message: "Invalid provider ID" });
    }

    // Check if the user adding the review is a customer
    const customer = await User.findById(req.user._id); // req.userId comes from token
    if (!customer || customer.type !== "customer") {
      return res
        .status(403)
        .json({ message: "Only customers can add reviews" });
    }

    // Create a new review
    const newReview = new Review({
      customerId: req.user._id,
      providerId,
      rating,
      comment,
    });

    // Save the review to the database
    await newReview.save();

    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

exports.getProviderReviews = async (req, res) => {
  const { providerId } = req.params;

  try {
    const reviews = await Review.find({ providerId })
      .populate("customerId", "fullName profileImg  ") // Include customer details in response
      .populate("providerId", "fullName profileImg phone nationalId") // Include provider details in response
      .sort({ createdAt: -1 }); // Sort reviews by newest first

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

exports.updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure only the reviewer (customer) can update their review
    if (review.customerId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own review" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure only the reviewer (customer) can delete their review
    if (review.customerId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own review" });
    }

    await Review.deleteOne({ _id: review._id });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};
