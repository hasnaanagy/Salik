const ServiceRequest = require("../models/RequestService");
const Service = require("../models/Service"); // Providers are stored in Service model
const User = require("../models/User");

const requestController = (io) => {
    /**
     * @desc Customer creates a service request
     * @route POST /api/requests
     * @access Customer only
     */
    const createRequest = async (req, res) => {
        try {
            console.log("[CREATE REQUEST] Request Body:", req.body);
            const { serviceType, location, problemDescription } = req.body;
    
            if (req.user.type !== "customer") {
                return res.status(403).json({ message: "Only customers can create requests" });
            }
    
            if (!serviceType || !location || !problemDescription) {
                return res.status(400).json({ message: "Missing required fields" });
            }
    
            const newRequest = new ServiceRequest({
                customerId: req.user._id,
                serviceType,
                location,
                problemDescription,
                status: "pending",
                notifiedProviders: [],
            });
    
            await newRequest.save();
    
            const nearbyProviders = await Service.find({
                serviceType,
                location: {
                    $near: {
                        $geometry: location,
                        $maxDistance: 5000,
                    },
                },
            }).populate("userId");
    
            if (nearbyProviders.length) {
                const notifiedProviderIds = nearbyProviders.map(provider => provider.userId?._id).filter(Boolean);
                
                for (const providerId of notifiedProviderIds) {
                    io.to(providerId.toString()).emit("newServiceRequest", newRequest);
                    await User.findByIdAndUpdate(providerId, {
                        $push: { notifiedRequests: newRequest._id },
                    });
                }
                
                newRequest.notifiedProviders = notifiedProviderIds;
                await newRequest.save();
            }
    
            res.status(201).json({ message: "Request created successfully", request: newRequest });
        } catch (error) {
            console.error("[CREATE REQUEST] Server error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };
    
    /**
     * @desc Update service request status (accept, confirm, complete)
     * @route POST /api/requests/update
     * @access Customer & Provider
     */
    const updateRequestStatus = async (req, res) => {
        try {
            const { requestId, action, providerId } = req.body;
            const request = await ServiceRequest.findById(requestId);
            if (!request) return res.status(404).json({ message: "Request not found" });
    
            if (action === "accept") {
                if (req.user.type !== "provider") return res.status(403).json({ message: "Only providers can accept requests" });
                if (!request.acceptedProviders.includes(req.user._id)) request.acceptedProviders.push(req.user._id);
                if (request.status === "pending") request.status = "accepted";
    
            } else if (action === "confirm") {
                if (req.user.type !== "customer") return res.status(403).json({ message: "Only customers can confirm providers" });
                if (!providerId || !request.acceptedProviders.includes(providerId)) return res.status(400).json({ message: "Invalid provider confirmation" });
                request.confirmedProvider = providerId;
                request.status = "confirmed";
    
            } else if (action === "complete") {
                if (req.user.type !== "customer") return res.status(403).json({ message: "Only customers can complete requests" });
                if (request.status !== "confirmed") return res.status(400).json({ message: "Request is not confirmed yet" });
                request.status = "completed";
            } else {
                return res.status(400).json({ message: "Invalid action" });
            }
    
            await request.save();
            res.status(200).json({ message: `Request ${action}d successfully`, request });
    
        } catch (error) {
            console.error("[UPDATE REQUEST] Server error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };
    
    /**
     * @desc Get all requests for a logged-in customer or provider
     * @route GET /api/requests
     * @access Customer & Provider
     */
    const getRequests = async (req, res) => {
        try {
            let requests;
            
            if (req.user.type === "customer") {
                requests = await ServiceRequest.find({ customerId: req.user._id })
                    .populate("confirmedProvider", "fullName phone profileImg")
                    .populate("acceptedProviders", "fullName phone profileImg");
            } else if (req.user.type === "provider") {
                requests = await ServiceRequest.find({
                    $or: [
                        { notifiedProviders: req.user._id },
                        { acceptedProviders: req.user._id },
                        { confirmedProvider: req.user._id }
                    ]
                })
                .populate("customerId", "fullName phone profileImg")
                .populate("confirmedProvider", "fullName phone profileImg");
            } else {
                return res.status(403).json({ message: "Invalid user type" });
            }
    
            const groupedRequests = {
                pending: [],
                accepted: [],
                confirmed: [],
                completed: [],
            };
    
            requests.forEach((request) => {
                groupedRequests[request.status].push(request);
            });
    
            res.status(200).json({ requests: groupedRequests });
        } catch (error) {
            console.error("[GET REQUESTS] Server error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };
    
    return {
        createRequest,
        updateRequestStatus,
        getRequests
    };
};

module.exports = requestController;
