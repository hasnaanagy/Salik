const Service = require("../models/Service");
const User = require("../models/User");

// Create a new service (fuel or mechanic)
exports.createService = async (req, res) => {
  try {
    const { serviceType, location, workingDays, workingHours } = req.body;
    const { userId } = req;

    if (!serviceType || !workingDays || !workingHours) {
      return res.status(400).json({ message: "Service type, working days, and working hours are required." });
    }

    if (!location || (!location.coordinates && !location.description)) {
      return res.status(400).json({ message: "At least one location format (coordinates or description) is required." });
    }

    let locationData = null;
    let addressOnly = null;

    // Handle coordinates-based location
    if (location.coordinates) {
      if (
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2 ||
        typeof location.coordinates[0] !== "number" ||
        typeof location.coordinates[1] !== "number"
      ) {
        return res.status(400).json({ message: "Invalid coordinates format. Expected [longitude, latitude]." });
      }

      locationData = {
        type: "Point",
        coordinates: location.coordinates,
      };
    }

    // Store description separately
    if (location.description) {
      addressOnly = location.description;
    }

    // Ensure provider does not create duplicate services
    const existingService = await Service.findOne({ userId, serviceType });
    if (existingService) {
      return res.status(400).json({ message: `You already have a ${serviceType} service. Delete the old one before creating a new one.` });
    }

    // Create new service
    const newService = new Service({
      userId,
      serviceType,
      location: locationData,
      addressOnly, // Store the description separately
      workingDays,
      workingHours,
    });

    await newService.save();
    res.status(201).json({ message: `${serviceType} service created successfully.`, service: newService });

  } catch (err) {
    res.status(500).json({ message: "Error creating service", error: err.message });
  }
};


exports.updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { location, workingDays, workingHours } = req.body;
    const { userId } = req;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only update your own services" });
    }

    if (location && location.coordinates) {
      if (
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2 ||
        typeof location.coordinates[0] !== "number" ||
        typeof location.coordinates[1] !== "number"
      ) {
        return res.status(400).json({ message: "Invalid coordinates format. Expected [longitude, latitude]." });
      }
      service.location = {
        type: "Point",
        coordinates: location.coordinates,
      };
    }

    // ✅ Update description without affecting coordinates
    if (location && location.description) {
      service.addressOnly = location.description;
      service.markModified("addressOnly"); // ✅ Ensures Mongoose detects the change
    }

    if (workingDays) service.workingDays = workingDays;
    if (workingHours) service.workingHours = workingHours;

    await service.save();
    res.status(200).json({ message: "Service updated successfully", service });

  } catch (err) {
    res.status(500).json({ message: "Error updating service", error: err.message });
  }
};


// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { userId } = req;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own services" });
    }

    await service.deleteOne();
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting service", error: err.message });
  }
};

// Get all services of a provider
exports.getServicesByProvider = async (req, res) => {
  try {
    const { userId } = req;

    const services = await Service.find({ userId });
    if (services.length === 0) {
      return res.status(404).json({ message: "No services found for this provider" });
    }

    res.status(200).json({ message: "Services retrieved successfully", services });
  } catch (err) {
    res.status(500).json({ message: "Error fetching services", error: err.message });
  }
};

// Search services by location (coordinates or description) or serviceType
exports.searchServices = async (req, res) => {
  try {
    const { latitude, longitude, location, serviceType } = req.query;
    let query = {};

    // Search by Geo-coordinates
    if (latitude && longitude) {
      query.location = {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)], // [longitude, latitude]
          },
          $maxDistance: 5000, // 5 km max distance
        },
      };
    }

    // Search by Text Location (Description)
    if (location) {
      query.addressOnly = { $regex: new RegExp(location, "i") }; // Case-insensitive match
    }

    // Search by Service Type
    if (serviceType) {
      query.serviceType = serviceType;
    }

    const services = await Service.find(query);

    if (services.length === 0) {
      return res.status(404).json({ message: "No services found." });
    }

    res.status(200).json({ message: "Services found", services });
  } catch (err) {
    res.status(500).json({ message: "Error searching for services", error: err.message });
  }
};
