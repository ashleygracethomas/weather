import axios from "axios";

const SEND_OTP_URL = "http://localhost:5000/api/auth/send-otp";

const resendOtp = async (email) => {
  try {
    const response = await axios.post(
      SEND_OTP_URL,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, message: response.data.message };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to resend OTP";
    return { success: false, message };
  }
};

export default resendOtp;
