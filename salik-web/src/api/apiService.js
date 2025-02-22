import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

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
  patch: async (endpoint, data) => {
    const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    const response = await axiosInstance.patch(`/${endpoint}`, data, { headers });
    return response.data;
  },
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
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  
};

export default apiService;
