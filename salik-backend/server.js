// Load environment variables
require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db"); // MongoDB config
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const rideBookingsRoutes = require("./routes/rideBookingRoutes");
const requestRoutes = require("./routes/requestRoutes");
const serviceReviewRoutes = require("./routes/serviceReviewRoutes"); // Add this line

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 5000;

const connectedProviders = new Map(); // Store provider sockets

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/rideBooking", rideBookingsRoutes);
app.use("/api/request", requestRoutes(io));
app.use("/api/serviceReviews", serviceReviewRoutes); // Add this line

// WebSocket Handling
io.on("connection", (socket) => {
    console.log("A provider connected:", socket.id);

    // Register provider socket with provider ID
    socket.on("registerProvider", (providerId) => {
        connectedProviders.set(providerId, socket);
        console.log(`Provider ${providerId} registered with socket ${socket.id}`);
    });

    // Handle customer service request notifications
    socket.on("customer-request", (requestData) => {
        console.log("New service request received:", requestData);

        connectedProviders.forEach((socket, providerId) => {
            if (requestData.notifiedProviders.includes(providerId.toString())) {
                socket.emit("new-service-request", requestData);
            }
        });
    });

    // Handle provider selection by the customer
    socket.on("confirm-provider", ({ customerId, providerId, requestId }) => {
        console.log(`Customer ${customerId} confirmed Provider ${providerId} for Request ${requestId}`);

        // Notify the selected provider
        if (connectedProviders.has(providerId)) {
            connectedProviders.get(providerId).emit("request-confirmed", { requestId, customerId });
        }
    });

    socket.on("disconnect", () => {
        console.log("A provider disconnected:", socket.id);
        
        // Remove disconnected provider
        connectedProviders.forEach((socketInstance, key) => {
            if (socketInstance.id === socket.id) {
                connectedProviders.delete(key);
            }
        });
    });
});

// Start Server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = { io, connectedProviders };
