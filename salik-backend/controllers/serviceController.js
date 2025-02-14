const Service = require("../models/Service");
const User = require("../models/User");

// Create a new service (fuel or mechanic)
exports.createService = async (req, res) => {
    try {
      const { serviceType, location, workingDays, workingHours } = req.body;
      const { userId } = req;
  
      if (!serviceType || !location || !workingDays || !workingHours) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Check if the provider already has a service of the same type
      const existingService = await Service.findOne({ userId, serviceType });
      if (existingService) {
        return res.status(400).json({
          message: `You already have a ${serviceType} service. You need to delete the old one before creating a new one.`,
        });
      }
  
      let locationData = {};
  
      // If it's a GeoJSON Point location
      if (location.type === "Point" && location.coordinates) {
        locationData = {
          type: "Point",
          coordinates: location.coordinates, // [longitude, latitude]
        };
      }
      // If it's a string-based location
      else if (location.type === "String" && location.description) {
        locationData = {
          type: "String",
          description: location.description, // e.g., "New York"
        };
      } else {
        return res.status(400).json({ message: "Invalid location format" });
      }
  
      // Create the new service
      const newService = new Service({
        userId,
        serviceType,
        location: locationData,
        workingDays,
        workingHours,
      });
  
      await newService.save();
      res.status(201).json({
        message: `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} service created successfully.`,
        service: newService,
      });
    } catch (err) {
      res.status(500).json({ message: "Error creating service", error: err.message });
    }
  };
  

// Update an existing service (fuel or mechanic)
exports.updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { location, workingDays, workingHours } = req.body;
    const { userId } = req;

    // Find the service by ID and check if the logged-in user owns the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only update your own services" });
    }

    // Validate and update location if provided
    if (location) {
      let locationData = {};
      if (location.type === "Point" && location.coordinates && location.coordinates.length === 2) {
        locationData = {
          type: "Point",
          coordinates: location.coordinates, // [longitude, latitude]
        };
      } else if (location.type === "String" && location.description) {
        locationData = {
          type: "String",
          description: location.description, // e.g., "New York"
        };
      } else {
        return res.status(400).json({ message: "Invalid location format. Coordinates required for GeoJSON." });
      }
      service.location = locationData;
    }

    // Update other fields
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

// Search services (fuel or mechanic) by location
exports.searchServices = async (req, res) => {
  try {
    const { latitude, longitude, serviceType } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and Longitude are required." });
    }

    let query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)], // [longitude, latitude]
          },
          $maxDistance: 5000, // 5 km max distance
        },
      },
    };

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
