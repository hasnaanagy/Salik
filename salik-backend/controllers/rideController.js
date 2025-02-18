const Ride = require("../models/Ride");
const User = require("../models/User");

// Create new ride
exports.createRide = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.type !== "provider") {
      return res.status(403).json({ message: "Only Providers can create rides." });
    }

    const { carType, fromLocation, toLocation, totalSeats, price, date, time } = req.body;

    if (!carType || !fromLocation || !toLocation || !totalSeats || !price || !date) {
      return res.status(400).json({ message: "All fields except 'time' are required." });
    }

    // Construct rideDateTime using the provided date and time
    const rideDateTime = new Date(`${date}T${time || "00:00"}:00.000Z`); // Default time: 00:00
    if (isNaN(rideDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format." });
    }

    const existingRide = await Ride.findOne({ providerId: user._id, rideDateTime });
    if (existingRide) {
      return res.status(400).json({ message: "You already have a ride scheduled at this date and time." });
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
    res.status(201).json({ message: "Ride created successfully", ride: newRide });
  } catch (err) {
    res.status(500).json({ message: "Error creating ride", error: err.message });
  }
};


// Search rides
exports.searchRides = async (req, res) => {
  try {
    const { fromLocation, toLocation, date, time } = req.query;

    if (!fromLocation || !toLocation || !date) {
      return res.status(400).json({ message: "Both 'fromLocation' and 'toLocation' and 'date' are required." });
    }

    // Convert date & time into a full Date object
    let startDateTime = new Date(`${date}T${time || "00:00"}:00.000Z`); // Default time: 00:00 UTC
    if (isNaN(startDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format." });
    }

    // Set the end of the day for filtering (if time is not provided, search for the entire day)
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(23, 59, 59, 999);

    let query = {
      fromLocation: { $regex: new RegExp(fromLocation, "i") },
      toLocation: { $regex: new RegExp(toLocation, "i") },
      rideDateTime: { $gte: startDateTime, $lte: endDateTime },
    };

    const rides = await Ride.find(query);

    if (rides.length === 0) {
      return res.status(404).json({ message: "No rides found matching your criteria." });
    }

    res.status(200).json({ message: "Rides retrieved successfully", rides });
  } catch (err) {
    res.status(500).json({ message: "Error searching for rides", error: err.message });
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
    const ride = await Ride.findById(req.params.id).populate("providerId", "fullName profileImg phone");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    res.status(200).json({ ride });
  } catch (err) {
    res.status(500).json({ message: "Error fetching ride", error: err });
  }
};

// Update ride details
exports.updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.providerId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only update your own rides" });
    }

    const { carType, fromLocation, toLocation, totalSeats, price, rideDateTime } = req.body;

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
    res.status(500).json({ message: "Error updating ride", error: err.message });
  }
};

// Delete ride
exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.providerId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own rides" });
    }

    await Ride.deleteOne({ _id: ride._id });
    res.status(200).json({ message: "Ride deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting ride", error: err.message });
  }
};

// Get rides by user
exports.getRidesByUser = async (req, res) => {
  try {
    const rides = await Ride.find({ providerId: req.userId });
    if (rides.length === 0) {
      return res.status(404).json({ message: "No rides found for this provider" });
    }
    res.status(200).json({ message: "Rides retrieved successfully", rides });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's rides", error: err.message });
  }
};
