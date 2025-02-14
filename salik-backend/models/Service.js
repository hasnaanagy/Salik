const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming the provider is a User
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.Mixed, // Allow both geospatial and string types
    required: true,
  },
  serviceType: {
    type: String,
    enum: ["fuel", "mechanic"],
    required: true,
  },
  workingDays: {
    type: [String],
    required: true,
  },
  workingHours: {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
});

// Index only if location is GeoJSON (Point)
serviceSchema.index({ location: "2dsphere" }); // GeoJSON index for geospatial queries

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
