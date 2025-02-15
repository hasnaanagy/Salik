require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db"); // Assuming you have a separate db config file
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes"); // Import ride routes
const serviceRoutes = require("./routes/serviceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/reviews", reviewRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
