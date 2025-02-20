const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: { type: String, enum: ["fuel", "mechanic"], required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    problemDescription: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
