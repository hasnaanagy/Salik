import axios from "axios";

// Set the base URL for your API
const API_URL = "http://localhost:5000/api"; // Replace with your actual API URL

// Create axios instance with token in headers
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to headers for every request if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API call to get rides
const getRides = async () => {
    try {
        const response = await axiosInstance.get("/rides");
        return response.data; // Returns { upcoming, completed }
    } catch (error) {
        throw error;
    }
};

export { getRides };