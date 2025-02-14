import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",  // Replace with your actual backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error.response?.data || "An error occurred");
    }
);

export default api;
