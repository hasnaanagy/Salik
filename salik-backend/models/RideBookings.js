const mongoose = require("mongoose");

const rideBookingSchema = new mongoose.Schema(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Customer who booked
        rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true }, // Reference to the ride
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Provider offering the ride
        bookedSeats: { type: Number, required: true }, // Seats booked by the customer
        status: { type: String, enum: ["upcoming", "cancelled", "completed"], default: "upcoming" }, // Booking status
        bookingDate: { type: Date, default: Date.now }, // When the customer booked the ride
    },
    { timestamps: true }
);

module.exports = mongoose.model("RideBookings", rideBookingSchema);
