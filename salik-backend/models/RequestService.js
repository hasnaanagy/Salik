const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: { type: String, enum: ["fuel", "mechanic"], required: true },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    problemDescription: { type: String, required: true },
    acceptedProviders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Providers who accepted
    confirmedProvider: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Selected provider
    status: { type: String, enum: ["pending", "accepted", "confirmed", "completed"], default: "pending" }
}, { timestamps: true });

serviceRequestSchema.index({ location: "2dsphere" }); // Enable geospatial queries

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
