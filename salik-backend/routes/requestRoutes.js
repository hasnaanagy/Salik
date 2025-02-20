const express = require("express");

module.exports = (io) => {
    const {
        createRequest,
        getUserRequests,
        acceptRequest,
        confirmProvider
    } = require("../controllers/requestController")(io); // Pass io to controller

    const { verifyToken } = require("../middleware/verifyToken"); // Authentication middleware
    const router = express.Router();

    router.post("/", verifyToken, createRequest);
    router.get("/", verifyToken, getUserRequests);
    router.post("/accept", verifyToken, acceptRequest);
    router.post("/confirm", verifyToken, confirmProvider);

    return router;
};
