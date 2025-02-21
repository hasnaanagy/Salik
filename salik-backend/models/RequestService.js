const mongoose = require("mongoose");

const requestServiceSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: { type: String, required: true },
    location: { type: { type: String, enum: ["Point"] }, coordinates: { type: [Number], required: true } },
    problemDescription: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "confirmed", "completed"], default: "pending" },
    notifiedProviders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    acceptedProviders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    confirmedProvider: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

requestServiceSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("ServiceRequest", requestServiceSchema);
