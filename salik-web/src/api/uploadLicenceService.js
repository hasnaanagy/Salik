import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Replace with actual API endpoint

// Function to get token from local storage
const getToken = () => localStorage.getItem("token");

// Fetch user details from the backend
const fetchUser = async () => {
    const token = getToken();
    if (!token) throw "User is not authenticated.";

    const response = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

// Upload Image Function
export const uploadImageApi = async (file, type) => {
    try {
        const token = getToken();
        if (!token) throw "Authentication required.";

        // Get user details from DB
        const user = await fetchUser();

        // Check if user is a provider
        if (user.userType !== "provider") {
            throw "Only providers can upload images.";
        }

        // Prevent re-upload if image already exists
        if ((type === "profilePhoto" && user.profilePhoto) || (type === "licensePhoto" && user.licensePhoto)) {
            throw "You have already uploaded this image.";
        }

        // Upload Image
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Assuming API returns { url: "uploaded_image_url" }
    } catch (error) {
        throw error.response?.data?.message || error || "Image upload failed";
    }
};