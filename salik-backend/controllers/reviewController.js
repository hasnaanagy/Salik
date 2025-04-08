const Review = require("../models/Review");
const User = require("../models/User");

// Add review controller
exports.addReview = async (req, res) => {
  const { rating, comment, serviceType } = req.body;
  const providerId = req.params.id;
  try {
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(400).json({ message: "Invalid provider ID" });
    }

    const customer = await User.findById(req.user._id);
    if (!customer || customer.type !== "customer") {
      return res.status(403).json({ message: "Only customers can add reviews" });
    }

    const newReview = new Review({
      customerId: req.user._id,
      providerId,
      rating,
      comment,
      serviceType, // Add serviceType from request body
    });

    await newReview.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

exports.getProviderReviews = async (req, res) => {
  const { providerId } = req.params;
  const { serviceType } = req.query; // Optional query param: "ride", "fuel", or "mechanic"

  try {
    const query = { providerId };
    if (serviceType) {
      query.serviceType = serviceType; // Filter by service type if provided
    }

    const reviews = await Review.find(query)
      .populate("customerId", "fullName profileImg")
      .populate("providerId", "fullName profileImg phone nationalId")
      .sort({ createdAt: -1 });

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
    if (review.customerId.toString() !== req.user._id.toString()) {
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
    if (review.customerId.toString() !== req.user._id.toString()) {
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
