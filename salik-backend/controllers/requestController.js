const ServiceRequest = require("../models/RequestService");
const Service = require("../models/Service"); // Providers are stored in Service model

const requestController = (io) => {
    /**
     * @desc Customer creates a service request
     * @route POST /api/requests
     * @access Customer only
     */
    const createRequest = async (req, res) => {
        try {
            console.log("Request Body:", req.body);
            const { serviceType, location, problemDescription } = req.body;

            // Ensure the user is a customer
            if (req.user.type !== "customer") {
                return res.status(403).json({ message: "Only customers can create requests" });
            }

            if (!serviceType || !location || !problemDescription) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const newRequest = new ServiceRequest({
                customerId:  req.user._id,
                serviceType,
                location,
                problemDescription,
            });

            await newRequest.save();

            // Notify nearby providers using WebSocket
            io.emit("newServiceRequest", newRequest);

            res.status(201).json({ message: "Request created successfully", request: newRequest });
        } catch (error) {
            console.error("Server error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };

    /**
     * @desc Get all requests of a logged-in customer
     * @route GET /api/requests
     * @access Customer only
     */
    const getUserRequests = async (req, res) => {
        try {
            const requests = await ServiceRequest.find({ customerId: req.user.id });
            res.status(200).json(requests);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };

    /**
     * @desc Provider accepts a service request
     * @route POST /api/requests/accept
     * @access Provider only
     */

    const acceptRequest = async (req, res) => {
        try {
            const { requestId } = req.body;
            const providerId = req.user._id;
    
            // Ensure only providers can accept requests
            if (req.user.type !== "provider") {
                return res.status(403).json({ message: "Only providers can accept requests" });
            }
    
            const request = await ServiceRequest.findById(requestId);
            if (!request) return res.status(404).json({ message: "Request not found" });
    
            // Check if provider is already in acceptedProviders
            if (request.acceptedProviders.includes(providerId)) {
                return res.status(400).json({ message: "You have already accepted this request" });
            }
    
            // Add provider to acceptedProviders
            request.acceptedProviders.push(providerId);
            
            // Change status to "waiting for confirmation" if it's still "pending"
            if (request.status === "pending") {
                request.status = "accepted";
            }
    
            await request.save();
    
            return res.status(200).json({ message: "Request accepted successfully", request });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    };
    
    

    /**
     * @desc Confirm a provider for a request
     * @route POST /api/requests/confirm
     * @access Customer only
     */
    const confirmProvider = async (req, res) => {
        try {
            console.log("Confirm Provider Body:", req.body);
            const { requestId, providerId } = req.body; // ✅ Extract providerId from request body
    
            // Ensure the user is a customer
            if (req.user.type !== "customer") {
                return res.status(403).json({ message: "Only customers can confirm providers" });
            }
    
            if (!requestId || !providerId) {
                return res.status(400).json({ message: "Request ID and Provider ID are required" });
            }
    
            const request = await ServiceRequest.findById(requestId);
            if (!request) {
                return res.status(404).json({ message: "Request not found" });
            }
    
            // Ensure provider is one of the accepted providers
            if (!request.acceptedProviders.includes(providerId)) {
                return res.status(403).json({ message: "Invalid provider confirmation" });
            }
    
            // Update request status and assign provider
            request.confirmedProvider = providerId;
            request.status = "confirmed";
            await request.save();
    
            // Notify the provider about confirmation
            io.emit("providerConfirmed", { requestId, providerId });
    
            res.status(200).json({ message: "Provider confirmed", request });
        } catch (error) {
            console.error("Server error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };
    

    return {
        createRequest,
        getUserRequests,
        acceptRequest,
        confirmProvider,
    };
};

module.exports = requestController;
