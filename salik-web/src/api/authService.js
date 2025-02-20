// services/authService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth/';

export const signupUserAPI = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}signup`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || 'Signup failed';
  }
};
// Login API
// Login API
export const loginUserAPI = async (loginData) => {
    try {
      const response = await axios.post(`${BASE_URL}login`, loginData, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        
      }
  
      return response.data; // User data
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };