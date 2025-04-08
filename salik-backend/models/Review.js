const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
    serviceType: {
      type: String,
      enum: ["ride", "fuel", "mechanic"],
      required: true, // Ensures every review is categorized
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);