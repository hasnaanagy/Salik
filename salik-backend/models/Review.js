const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the customer
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the provider
    rating: { type: Number, min: 1, max: 5, required: true }, // Rating between 1 and 5
    comment: { type: String, default: "" }, // Optional comment
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
