import axios from "axios";


const BASE_URL = 'http://localhost:5000/api/auth/';

export async function registerUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}signup`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Unexpected error. Please try again.";
    console.error('Error registering user:', errorMessage);
    throw new Error(errorMessage);
  }
}

export async function loginUserApi(userData) {
  try {

    console.log("Logging in user with data:", userData);
    const response = await axios.post(`${BASE_URL}login`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error.response?.data || error.message);
    throw error;
  }
}