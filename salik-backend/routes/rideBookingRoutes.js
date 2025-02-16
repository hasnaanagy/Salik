const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
    getProviderRides,
    getCustomerRides,
    bookRide,
    cancelRideBooking
} = require("../controllers/rideBookingController");

const router = express.Router();

// Routes
router.post("/", verifyToken, bookRide); // ✅ Customers must be authenticated to book a ride
router.get("/customer/:customerId", verifyToken, getCustomerRides); // ✅ Get customer bookings
router.get("/provider/:providerId", verifyToken, getProviderRides); // ✅ Get provider bookings
router.patch("/:bookingId", verifyToken, cancelRideBooking); // ✅ Only logged-in users can cancel a booking

module.exports = router;
