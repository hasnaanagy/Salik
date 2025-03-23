import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.1.104:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Add token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  patch: async (endpoint, data) => {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    const response = await axiosInstance.patch(`/${endpoint}`, data, {
      headers,
    });
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
      return response.data;
    } catch (error) {
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
