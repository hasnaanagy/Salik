const mongoose = require("mongoose");

const serviceReviewSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    comment: { 
      type: String, 
      default: "" 
    },
  },
  { timestamps: true }
);

// Compound index to ensure a user can only review a service once
serviceReviewSchema.index({ serviceId: 1, customerId: 1 }, { unique: true });

module.exports = mongoose.model("ServiceReview", serviceReviewSchema);