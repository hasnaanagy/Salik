// Load environment variables
require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db"); // MongoDB config
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const rideBookingsRoutes = require("./routes/rideBookingRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 5000;

const connectedProviders = {}; // Store provider sockets

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/rideBooking", rideBookingsRoutes);
app.use("/api/request", requestRoutes(io)); // Pass io to request routes

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log("A provider connected:", socket.id);

    socket.on("registerProvider", (providerId) => {
        connectedProviders[providerId] = socket;
    });

    socket.on("disconnect", () => {
        console.log("A provider disconnected:", socket.id);
        Object.keys(connectedProviders).forEach((key) => {
            if (connectedProviders[key] === socket) {
                delete connectedProviders[key];
            }
        });
    });
});

// Start Server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { io, connectedProviders };
