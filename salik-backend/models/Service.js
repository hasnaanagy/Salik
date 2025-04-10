const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceType: { type: String, required: true, enum: ["fuel", "mechanic"] },

  // GeoJSON Location
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: function (val) {
          return !val || val.length === 2;
        },
        message:
          "Coordinates must have exactly 2 values: [longitude, latitude].",
      },
    },
  },

  // Store location description separately
  addressOnly: { type: String, default: null },

  workingDays: { type: [String], required: true },
  workingHours: {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  
  // New fields for ratings
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
});

// Index location for geospatial queries
serviceSchema.index({ location: "2dsphere" });

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
