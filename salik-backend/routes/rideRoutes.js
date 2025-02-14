const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
    createRide,
    getAllRides,
    getRideById,
    updateRide,
    deleteRide,
    getRidesByUser,
    searchRides
} = require("../controllers/rideController");

const router = express.Router();

// Routes
router.get("/", getAllRides);
router.get("/search", searchRides); // ✅ Move above "/:id" to avoid conflicts
router.get("/myrides", verifyToken, getRidesByUser);
router.get("/:id", getRideById);
router.post("/", verifyToken, createRide);
router.put("/:id", verifyToken, updateRide);
router.delete("/:id", verifyToken, deleteRide);

module.exports = router;
