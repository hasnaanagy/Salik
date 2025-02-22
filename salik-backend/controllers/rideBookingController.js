const Ride = require("../models/Ride");
const RideBooking = require("../models/RideBookings");
const User = require("../models/User");

// Book a Ride
exports.bookRide = async (req, res) => {
  try {
    const customerId = req.user._id; // Extract from token
    const { rideId, bookedSeats } = req.body;

    // Get the ride and user info
    const ride = await Ride.findById(rideId);
    const user = await User.findById(customerId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure only customers can book a ride
    if (user.type !== "customer") {
      return res
        .status(403)
        .json({ message: "Only customers can book rides." });
    }

    // Prevent booking a past or canceled ride
    if (ride.status === "cancelled" || ride.rideDateTime < new Date()) {
      return res
        .status(400)
        .json({ message: "Ride is not available for booking" });
    }

    // Prevent overbooking seats
    if (ride.totalSeats - ride.bookedSeats < bookedSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Create new booking
    const newBooking = new RideBooking({
      customerId,
      rideId,
      providerId: ride.providerId,
      bookedSeats,
      status: "upcoming",
    });

    await newBooking.save();

    // Update booked seats count
    ride.bookedSeats += bookedSeats;
    await ride.save();

    res
      .status(201)
      .json({ message: "Ride booked successfully", booking: newBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error booking ride", error: error.message });
  }
};

// Get Rides for a User (Both Customer & Provider)
exports.getUserRides = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const upcomingRides = [];
    const pastRides = [];
    const cancelledRides = [];

    const bookedRides = await RideBooking.find({ customerId: userId }).populate(
      "rideId"
    );

    bookedRides.forEach((booking) => {
      if (!booking.rideId) return;

      const ride = booking.rideId;
      const formattedBooking = {
        _id: booking._id, // Booking ID
        rideId: ride._id,
        providerId: ride.providerId,
        bookedSeats: booking.bookedSeats,
        status: booking.status,
        rideDateTime: ride.rideDateTime,
        fromLocation: ride.fromLocation,
        toLocation: ride.toLocation,
        carType: ride.carType,
        totalSeats: ride.totalSeats,
        price: ride.price,
      };

      if (booking.status === "cancelled") {
        cancelledRides.push(formattedBooking);
      } else if (ride.rideDateTime < now) {
        pastRides.push(formattedBooking);
      } else {
        upcomingRides.push(formattedBooking);
      }
    });

    res.status(200).json({ upcomingRides, pastRides, cancelledRides });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user rides", error: error.message });
  }
};

// Cancel Ride Booking// Cancel Ride Booking (Customer)// Allow Customer to Cancel Their Booking
exports.cancelRideBooking = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { bookingId } = req.params;

    const booking = await RideBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.customerId.toString() !== customerId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only cancel your own bookings" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    const ride = await Ride.findById(booking.rideId);
    if (ride) {
      ride.bookedSeats = Math.max(0, ride.bookedSeats - booking.bookedSeats);
      await ride.save();
    }

    res
      .status(200)
      .json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling booking", error: error.message });
  }
};
