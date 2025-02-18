// src/api/apiService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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

  update: async (endpoint, id, data) => {
    const response = await axiosInstance.put(`/${endpoint}/${id}`, data);
    return response.data;
  },

  delete: async (endpoint, id) => {
    const response = await axiosInstance.delete(`/${endpoint}/${id}`);
    return response.data;
  },
};

export default apiService;
