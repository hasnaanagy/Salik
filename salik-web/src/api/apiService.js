import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust if needed

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  getAll: async (endpoint) => {
    const response = await axiosInstance.get(`/${endpoint}`);
    return response.data;
  },
  getById: async (endpoint, id) => {
    const response = await axiosInstance.get(`/${endpoint}/${id}`);
    return response.data;
  },
  create: async (endpoint, data) => {
    const response = await axiosInstance.post(`/${endpoint}`, data);
    return response.data;
  },
  update: async (endpoint, data) => {
    try {
      const response = await axiosInstance.put(`/${endpoint}`, data);
      console.log("🔄 API PUT Response:", response);
      console.log("✅ API Response Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ API Update Error:", error);
      throw error;
    }
  },
  delete: async (endpoint, id) => {
    const response = await axiosInstance.delete(`/${endpoint}/${id}`);
    return response.data;
  },
  updateWithFormData: async (endpoint, id, formData) => {
    const response = await axiosInstance.put(`/${endpoint}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  patchWithFormData: async (endpoint, formData) => {
    console.log("🟢 Making PATCH request to:", `/${endpoint}`);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    const response = await axiosInstance.patch(`/${endpoint}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log("🟢 Server response in apiService:", response);
    return response.data;
  },
};

export default apiService;
