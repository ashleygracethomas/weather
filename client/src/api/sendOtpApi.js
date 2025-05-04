// src/api/sendOtpApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/send-otp";

const sendOtp = async (email) => {
  try {
    const response = await axios.post(API_URL, { email });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to send OTP";
    return { success: false, message };
  }
};

export default sendOtp;
