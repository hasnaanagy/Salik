const express = require("express");

module.exports = (io) => {
    const {
        createRequest,
        updateRequestStatus,
        getRequests,
    } = require("../controllers/requestController")(io); // Pass io to controller

    const { verifyToken } = require("../middleware/verifyToken"); // Authentication middleware
    const router = express.Router();

    router.post("/", verifyToken, createRequest);    
    router.get("/", verifyToken, getRequests);        
    router.patch("/", verifyToken, updateRequestStatus);  
    return router;
};
