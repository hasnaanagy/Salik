const Ride = require("../models/Ride");
const RideBooking = require("../models/RideBookings");
exports.bookRide = async (req, res) => {
    try {
        const customerId = req.userId; // Extract from token
        const { rideId, bookedSeats } = req.body;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.bookedSeats + bookedSeats > ride.totalSeats) {
            return res.status(400).json({ message: "Not enough seats available" });
        }

        const newBooking = new RideBooking({
            customerId,
            rideId,
            providerId: ride.providerId, // Get providerId from the Ride
            bookedSeats,
            status: "upcoming",
        });

        await newBooking.save();

        ride.bookedSeats += bookedSeats;
        await ride.save();

        res.status(201).json({ message: "Ride booked successfully", booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: "Error booking ride", error: error.message });
    }
};


exports.getCustomerRides = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Automatically update past rides when fetched
        await Ride.updateMany(
            { rideDateTime: { $lt: new Date() }, status: "upcoming" },
            { $set: { status: "completed" } }
        );

        const upcomingRides = await RideBooking.find({ customerId, status: "upcoming" }).populate("rideId");
        const cancelledRides = await RideBooking.find({ customerId, status: "cancelled" }).populate("rideId");
        const pastRides = await RideBooking.find({ customerId, status: "completed" }).populate("rideId");

        res.status(200).json({ upcomingRides, cancelledRides, pastRides });
    } catch (error) {
        res.status(500).json({ message: "Error fetching rides", error: error.message });
    }
};

exports.getProviderRides = async (req, res) => {
    try {
        const { providerId } = req.params;

        // Automatically update past rides when fetched
        await Ride.updateMany(
            { rideDateTime: { $lt: new Date() }, status: "upcoming" },
            { $set: { status: "completed" } }
        );

        const upcomingRides = await Ride.find({ providerId, status: "upcoming" });
        const cancelledRides = await Ride.find({ providerId, status: "cancelled" });
        const pastRides = await Ride.find({ providerId, status: "completed" });

        res.status(200).json({ upcomingRides, cancelledRides, pastRides });
    } catch (error) {
        res.status(500).json({ message: "Error fetching rides", error: error.message });
    }
};


exports.cancelRideBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await RideBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = "cancelled";
        await booking.save();

        const ride = await Ride.findById(booking.rideId);
        if (ride) {
            ride.bookedSeats -= booking.bookedSeats;
            await ride.save();
        }

        res.status(200).json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
};
