import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth/';

// Register User
export async function registerUser(userData) {
  try {
    console.log("Registering User with data:", userData); // Debugging log

    const response = await axios.post(`${BASE_URL}signup`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response?.data || error.message);
    throw error;
  }
}

// Login User
export async function loginUserApi(userData) {
  try {
    console.log("Logging in user with data:", userData); // Debugging log

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
