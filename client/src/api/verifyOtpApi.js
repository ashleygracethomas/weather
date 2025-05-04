import axios from "axios";

const VERIFY_OTP_URL = "http://localhost:5000/api/auth/verify-otp";

const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await axios.post(
      VERIFY_OTP_URL,
      { email, otp },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, message: response.data.message };
  } catch (error) {
    const message = error.response?.data?.message || "OTP verification failed";
    return { success: false, message };
  }
};

export default verifyOtp;
