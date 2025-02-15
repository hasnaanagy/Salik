const Ride = require("../models/Ride");
const User = require("../models/User"); // Assuming you have a User model

// Create new ride
exports.createRide = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.type !== "provider") {
      return res
        .status(403)
        .json({ message: "Only Providers can create rides." });
    }

    const {
      carType,
      fromLocation,
      toLocation,
      availableSeats,
      price,
      date,
      time,
    } = req.body;

    if (
      !carType ||
      !fromLocation ||
      !toLocation ||
      !availableSeats ||
      !price ||
      !date ||
      !time
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate and format date
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // Validate time format (12-hour format with AM/PM)
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (!timeRegex.test(time)) {
      return res
        .status(400)
        .json({ message: "Invalid time format. Use HH:mm AM/PM." });
    }

    // Check if a ride with the same date and time already exists for this provider
    const existingRide = await Ride.findOne({
      userId: user._id,
      date: formattedDate,
      time,
    });
    if (existingRide) {
      return res.status(400).json({
        message: "You already have a ride scheduled at this date and time.",
      });
    }

    const newRide = new Ride({
      userId: user._id,
      carType,
      fromLocation,
      toLocation,
      availableSeats,
      price,
      date: formattedDate, // Store as Date object
      time, // Store as HH:mm AM/PM string
    });

    await newRide.save();
    res.status(201).json({
      message: "Ride created successfully",
      ride: newRide,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating ride", error: err.message });
  }
};

exports.searchRides = async (req, res) => {
  try {
    const { fromLocation, toLocation, date, time } = req.query;

    if (!fromLocation || !toLocation) {
      return res.status(400).json({
        message: "Both 'fromLocation' and 'toLocation' are required.",
      });
    }

    let query = {
      fromLocation: { $regex: new RegExp(fromLocation, "i") },
      toLocation: { $regex: new RegExp(toLocation, "i") },
    };

    // Convert date to Date format for accurate searching
    if (date) {
      const formattedDate = new Date(date);
      if (isNaN(formattedDate.getTime())) {
        return res
          .status(400)
          .json({ message: "Invalid date format. Use YYYY-MM-DD." });
      }
      query.date = formattedDate;
    }

    if (time) {
      // Validate time format (HH:mm AM/PM)
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
      if (!timeRegex.test(time)) {
        return res
          .status(400)
          .json({ message: "Invalid time format. Use HH:mm AM/PM." });
      }
      query.time = time;
    }

    const rides = await Ride.find(query);

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
      "userId",
      "fullName profileImg phone "
    );

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

    // Check if the authenticated user is the provider of the ride
    if (ride.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own rides" });
    }

    // Extract fields from request body
    const {
      carType,
      fromLocation,
      toLocation,
      availableSeats,
      price,
      date,
      time,
    } = req.body;

    // Validate date and time fields before updating
    if (date && isNaN(new Date(date).getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    if (time) {
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
      if (!timeRegex.test(time)) {
        return res
          .status(400)
          .json({ message: "Invalid time format. Use HH:mm AM/PM." });
      }
    }

    // If either date or time is being updated, check if the new date-time conflicts with an existing ride
    if (date || time) {
      const formattedDate = date ? new Date(date) : ride.date;
      const formattedTime = time || ride.time;

      // Check for conflicting rides for the same provider (with same date and time)
      const conflictingRide = await Ride.findOne({
        userId: req.userId,
        date: formattedDate,
        time: formattedTime,
        _id: { $ne: req.params.id }, // Ensure we don't check the ride being updated
      });

      if (conflictingRide) {
        return res.status(400).json({
          message:
            "Conflict: You already have a ride scheduled at this date and time.",
        });
      }
    }

    // Update fields if provided
    if (carType) ride.carType = carType;
    if (fromLocation) ride.fromLocation = fromLocation;
    if (toLocation) ride.toLocation = toLocation;
    if (availableSeats) ride.availableSeats = availableSeats;
    if (price) ride.price = price;

    // Update date and time if provided
    if (date) ride.date = new Date(date);
    if (time) ride.time = time;

    await ride.save();
    res.status(200).json({ message: "Ride updated successfully", ride });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating ride", error: err.message });
  }
};

// Delete ride
exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if the authenticated user is the provider of the ride
    if (ride.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own rides" });
    }

    await Ride.deleteOne({ _id: ride._id });
    res.status(200).json({ message: "Ride deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting ride", error: err.message });
  }
};

// Get rides by userconst Ride = require("../models/Ride");

exports.getRidesByUser = async (req, res) => {
  try {
    console.log("Fetching rides for User ID:", req.userId);

    const rides = await Ride.find({ userId: req.userId });

    if (rides.length === 0) {
      return res
        .status(404)
        .json({ message: "No rides found for this provider" });
    }

    res.status(200).json({ message: "Rides retrieved successfully", rides });
  } catch (err) {
    console.error("Error fetching rides:", err);
    res
      .status(500)
      .json({ message: "Error fetching user's rides", error: err.message });
  }
};
