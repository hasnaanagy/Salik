const Ride = require("../models/Ride");
const User = require("../models/User");
const Booking = require("../models/RideBookings");
// Create new ride
// Create new ride
exports.createRide = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.type !== "provider") {
      return res
        .status(403)
        .json({ message: "Only Providers can create rides." });
    }

    const { carType, fromLocation, toLocation, totalSeats, price, date, time } =
      req.body;

    if (
      !carType ||
      !fromLocation ||
      !toLocation ||
      !totalSeats ||
      !price ||
      !date
    ) {
      return res
        .status(400)
        .json({ message: "All fields except 'time' are required." });
    }

    const rideDateTime = new Date(`${date}T${time || "00:00"}:00.000Z`);
    if (isNaN(rideDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format." });
    }

    const existingRide = await Ride.findOne({
      providerId: user._id,
      rideDateTime,
    });
    if (existingRide) {
      return res.status(400).json({
        message: "You already have a ride scheduled at this date and time.",
      });
    }

    const newRide = new Ride({
      providerId: user._id,
      carType,
      fromLocation,
      toLocation,
      totalSeats,
      price,
      rideDateTime,
      bookedSeats: 0,
      status: "upcoming",
    });

    await newRide.save();
    res
      .status(201)
      .json({ message: "Ride created successfully", ride: newRide });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating ride", error: err.message });
  }
};

// Search rides
exports.searchRides = async (req, res) => {
  try {
    const { fromLocation, toLocation, date, time } = req.query;

    if (!fromLocation || !toLocation || !date) {
      return res.status(400).json({
        message:
          "Both 'fromLocation' and 'toLocation' and 'date' are required.",
      });
    }

    // Convert date into a full Date object
    let startDateTime = new Date(`${date}T00:00:00.000Z`); // Start of the day
    let endDateTime = new Date(`${date}T23:59:59.999Z`); // End of the day

    if (time) {
      let searchTime = new Date(`${date}T${time}:00.000Z`);
      if (isNaN(searchTime.getTime())) {
        return res.status(400).json({ message: "Invalid time format." });
      }

      // Define a time range (±30 minutes)
      let timeRangeStart = new Date(searchTime);
      timeRangeStart.setMinutes(timeRangeStart.getMinutes() - 30);

      let timeRangeEnd = new Date(searchTime);
      timeRangeEnd.setMinutes(timeRangeEnd.getMinutes() + 30);

      // Ensure the search window does not exceed the day's limits
      startDateTime = timeRangeStart < startDateTime ? startDateTime : timeRangeStart;
      endDateTime = timeRangeEnd > endDateTime ? endDateTime : timeRangeEnd;
    }

    let query = {
      fromLocation: { $regex: new RegExp(fromLocation, "i") },
      toLocation: { $regex: new RegExp(toLocation, "i") },
      rideDateTime: { $gte: startDateTime, $lte: endDateTime },
    };
    // Sort reviews by newest first
    const rides = await Ride.find(query).populate(
      "providerId",
      "fullName profileImg phone nationalId"
    );

    if (rides.length === 0) {
      return res
        .status(404)
        .json({ message: "No rides found matching your criteria." });
    }

    res.status(200).json({ message: "Rides retrieved successfully", rides });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error searching for rides", error: err.message });
  }
};

// Get all rides
exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json({ rides });
  } catch (err) {
    res.status(500).json({ message: "Error fetching rides", error: err });
  }
};

// Get a ride by ID
exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      "providerId",
      "fullName profileImg phone"
    );

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    res.status(200).json({ ride });
  } catch (err) {
    res.status(500).json({ message: "Error fetching ride", error: err });
  }
};


const updateRideStatus = async () => {
  const currentDate = new Date();
  await Ride.updateMany(
    { rideDateTime: { $lt: currentDate }, status: "upcoming" },
    { $set: { status: "completed" } }
  );
};

// Update ride details
exports.updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }


    if (ride.providerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own rides" });
    }

    const {
      carType,
      fromLocation,
      toLocation,
      totalSeats,
      price,
      rideDateTime,
    } = req.body;

    if (rideDateTime) {
      const formattedDateTime = new Date(rideDateTime);
      if (isNaN(formattedDateTime.getTime())) {
        return res.status(400).json({ message: "Invalid date-time format." });
      }
      ride.rideDateTime = formattedDateTime;
    }

    if (carType) ride.carType = carType;
    if (fromLocation) ride.fromLocation = fromLocation;
    if (toLocation) ride.toLocation = toLocation;
    if (totalSeats) ride.totalSeats = totalSeats;
    if (price) ride.price = price;

    await ride.save();
    res.status(200).json({ message: "Ride updated successfully", ride });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating ride", error: err.message });
  }
};


// Get rides by user with categorized results
exports.getRidesByUser = async (req, res) => {
  try {
    await updateRideStatus();
    const rides = await Ride.find({ providerId: req.user._id });

    const upcomingRides = rides.filter((ride) => ride.status === "upcoming");
    const completedRides = rides.filter((ride) => ride.status === "completed");
    const canceledRides = rides.filter((ride) => ride.status === "canceled");

    res.status(200).json({
      message: "Rides retrieved successfully",
      upcoming: upcomingRides,
      completed: completedRides,
      canceled: canceledRides,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's rides", error: err.message });
  }
};

// Delete ride and cancel associated bookings
exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }


    if (ride.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own rides" });
    }

    await Booking.updateMany({ rideId: ride._id }, { $set: { status: "canceled" } });
    await Ride.deleteOne({ _id: ride._id });

    res.status(200).json({ message: "Ride deleted successfully, all bookings canceled" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting ride", error: err.message });
  }
};

