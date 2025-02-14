const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        carType: { type: String, required: true },
        fromLocation: { type: String, required: true },
        toLocation: { type: String, required: true },
        availableSeats: { type: Number, required: true },
        price: { type: Number, required: true },
        date: { type: Date, required: true }, // Store date in Date format
        time: { type: String, required: true, match: /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/ }, // Store time in 12-hour format with AM/PM
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
