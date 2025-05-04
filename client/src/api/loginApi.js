// src/api/loginApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/login"; // Update in .env for production

const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    return { success: false, message };
  }
};

export default login;