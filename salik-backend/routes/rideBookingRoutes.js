const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
    bookRide,
    cancelRideBooking,
    getUserRides
} = require("../controllers/rideBookingController");

const router = express.Router();

// Routes
router.post("/", verifyToken, bookRide); // ✅ Customers must be authenticated to book a ride
router.get("/", verifyToken, getUserRides); // ✅ Get customer bookings
router.patch("/:bookingId", verifyToken, cancelRideBooking); // ✅ Only logged-in users can cancel a booking

module.exports = router;
