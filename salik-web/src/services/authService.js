import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth/';


export const registerUser = async (userData) => {
  try {
    const response = await axios.post(BASE_URL + "signup", userData);
    return response.data;
  } catch (error) {
  
    throw error.response?.data?.message || "An error occurred. Please try again."; 
  }
};

export default { registerUser };


export async function loginUserApi(userData) {
  const response = await axios.post(`${BASE_URL}login`, userData, {
    headers: { 'Content-Type': 'application/json' },
  });
  localStorage.setItem('token', response.data.token);
  return response.data;
}