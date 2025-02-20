const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Provider who posted the ride
        carType: { type: String, required: true },
        fromLocation: { type: String, required: true },
        toLocation: { type: String, required: true },
        totalSeats: { type: Number, required: true },
        bookedSeats: { type: Number, default: 0 }, // Track how many seats are booked
        price: { type: Number, required: true },
        rideDateTime: { type: Date, required: true }, // Store both date and time
        status: { type: String, enum: ["upcoming", "completed", "cancelled"], default: "upcoming" }, // Ride status
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);