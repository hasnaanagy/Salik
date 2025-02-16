const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { verifyToken } = require("../middleware/verifyToken");

// Create a new service
router.post("/", verifyToken, serviceController.createService);

// Update an existing service
router.put("/:serviceId", verifyToken, serviceController.updateService);

// Delete a service
router.delete("/:serviceId", verifyToken, serviceController.deleteService);

// Get all services of the provider
router.get("/", verifyToken, serviceController.getServicesByProvider);

// Search for services by location
router.get("/search", serviceController.searchServices);

module.exports = router;
