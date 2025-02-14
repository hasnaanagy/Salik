import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/';

export async function registerUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function loginUserApi(userData) {
  try {
    const response = await axios.post(`${BASE_URL}auth/login`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}
