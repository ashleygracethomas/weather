// src/api/signupApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/signup"; // adjust to env in prod

const signup = async ({ name, email, password }) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        name,
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || "Signup failed";
    return { success: false, message };
  }
};

export default signup;
