const Ride = require("../models/Ride");
const User = require("../models/User");
const Booking = require("../models/RideBookings");
const moment = require("moment");
// Create new ride

exports.createRide = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("type nationalIdStatus licenseStatus");
    console.log("Fetched User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.type !== "provider") {
      return res
        .status(403)
        .json({ message: "Only Providers can create rides." });
    }

    // Check if both national ID and driving license are verified
    if (user.nationalIdStatus !== "verified" || user.licenseStatus !== "verified") {

      return res.status(403).json({
        message:
          "Your national ID and driving license must be verified by an admin before creating a ride.",
      });
    }

    const { carType, fromLocation, toLocation, totalSeats, price, date, time } =
      req.body;

    if (
      !carType ||
      !fromLocation ||
      !toLocation ||
      !totalSeats ||
      !price ||
      !date ||
      !time
    ) {
      return res
        .status(400)
        .json({ message: "All fields including 'time' are required." });
    }

    if (!moment(time, "h:mm A", true).isValid()) {
      return res
        .status(400)
        .json({
          message: "Invalid time format. Please use 'hh:mm AM/PM' format.",
        });
    }

    const rideDateTime = moment(
      `${date} ${time}`,
      "YYYY-MM-DD h:mm A"
    ).toDate();

    if (isNaN(rideDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format." });
    }

    const existingRide = await Ride.findOne({
      providerId: user._id,
      rideDateTime,
    });

    if (existingRide) {
      return res
        .status(400)
        .json({
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

// Other controllers remain unchanged...

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

    // Convert date to a full Date object (Start and End of the Day)
    let startDateTime = moment(`${date} 12:00 AM`, "YYYY-MM-DD hh:mm A")
      .utc()
      .toDate(); // Start of the day
    let endDateTime = moment(`${date} 11:59 PM`, "YYYY-MM-DD hh:mm A")
      .utc()
      .toDate(); // End of the day

    if (time) {
      // ✅ Convert AM/PM format to 24-hour format & ensure valid time
      let searchTime = moment(`${date} ${time}`, "YYYY-MM-DD hh:mm A").utc();

      if (!searchTime.isValid()) {
        return res
          .status(400)
          .json({ message: "Invalid time format. Use hh:mm AM/PM." });
      }

      // Define a ±30-minute search range
      let timeRangeStart = moment(searchTime).subtract(30, "minutes").toDate();
      let timeRangeEnd = moment(searchTime).add(30, "minutes").toDate();

      // Ensure search window does not exceed the day's limits
      startDateTime =
        timeRangeStart < startDateTime ? startDateTime : timeRangeStart;
      endDateTime = timeRangeEnd > endDateTime ? endDateTime : timeRangeEnd;
    }

    console.log("🔍 Searching between:", startDateTime, " and ", endDateTime);

    let query = {
      fromLocation: { $regex: new RegExp(fromLocation, "i") },
      toLocation: { $regex: new RegExp(toLocation, "i") },
      rideDateTime: { $gte: startDateTime, $lte: endDateTime },
    };

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
    res
      .status(500)
      .json({ message: "Error fetching user's rides", error: err.message });
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
      return res
        .status(403)
        .json({ message: "You can only delete your own rides" });
    }

    await Booking.updateMany(
      { rideId: ride._id },
      { $set: { status: "canceled" } }
    );
    await Ride.deleteOne({ _id: ride._id });

    res
      .status(200)
      .json({ message: "Ride deleted successfully, all bookings canceled" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting ride", error: err.message });
  }
};
