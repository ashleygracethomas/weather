import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import verifyOtp from "../../api/verifyOtpApi";
import resendOtp from "../../api/resendOtpApi";
import {
  FiSun,
  FiCloud,
  FiCloudRain,
  FiCloudSnow,
  FiCheckCircle,
} from "react-icons/fi";
import "../../css/weatherstyle.css";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState(
    <FiSun className="text-yellow-400" />
  );
  const [temperature, setTemperature] = useState("72°F");
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email;

  // Weather icon rotation effect
  useEffect(() => {
    const weatherIcons = [
      { icon: <FiSun className="text-yellow-400" />, temp: "72°F" },
      { icon: <FiCloud className="text-gray-300" />, temp: "65°F" },
      { icon: <FiCloudRain className="text-blue-300" />, temp: "58°F" },
      { icon: <FiCloudSnow className="text-blue-100" />, temp: "32°F" },
    ];

    let counter = 0;
    const weatherInterval = setInterval(() => {
      setCurrentWeatherIcon(weatherIcons[counter].icon);
      setTemperature(weatherIcons[counter].temp);
      counter = (counter + 1) % weatherIcons.length;
    }, 3000);

    return () => clearInterval(weatherInterval);
  }, []);

  const handleChange = (e) => {
    setOtp(e.target.value);
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { success, message } = await verifyOtp({ email, otp });

    if (success) {
      setSuccessMessage(message);
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(message);
      setSuccessMessage("");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    const { success, message } = await resendOtp(email);
    setResendMessage(message);
    setResending(false);
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-red-400 p-6 bg-gray-800 rounded-lg">
          No email provided. Please sign up first.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="text-center">
          <div className="relative mx-auto w-40 h-40">
            <div className="absolute inset-0 flex items-center justify-center">
              <FiSun className="text-yellow-400 text-6xl animate-spin-slow" />
            </div>
            <div className="absolute top-0 left-1/4 w-8 h-8 text-blue-300 animate-float-1">
              <FiCloud />
            </div>
            <div className="absolute top-1/4 right-1/4 w-6 h-6 text-blue-200 animate-float-2">
              <FiCloudRain />
            </div>
            <div className="absolute bottom-1/4 left-1/3 w-5 h-5 text-blue-100 animate-float-3">
              <FiCloudSnow />
            </div>
          </div>
          <h2 className="text-2xl text-yellow-400 mt-6">Verifying Your OTP</h2>
          <p className="text-gray-400 mt-2">Checking weather conditions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      {/* Animated Weather Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Sun */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-400 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-pulse"></div>

        {/* Clouds */}
        <div className="absolute top-1/4 left-1/4 w-32 h-12 bg-gray-300 rounded-full opacity-10 animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-40 h-14 bg-gray-400 rounded-full opacity-10 animate-float animation-delay-2000"></div>

        {/* Enhanced Rain Animation */}
        {React.isValidElement(currentWeatherIcon) &&
          currentWeatherIcon.type === FiCloudRain && (
            <>
              {/* Rain Drops */}
              {[...Array(30)].map((_, i) => (
                <div
                  key={`rain-${i}`}
                  className="absolute top-0 left-0 w-0.5 bg-blue-300 rounded-full opacity-80 animate-rain"
                  style={{
                    left: `${Math.random() * 100}%`,
                    height: `${10 + Math.random() * 10}px`,
                    animationDuration: `${0.5 + Math.random() * 1}s`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}

              {/* Rain Streaks */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={`streak-${i}`}
                  className="absolute top-0 left-0 w-px bg-blue-400 opacity-70 animate-rain-streak"
                  style={{
                    left: `${Math.random() * 100}%`,
                    height: `${20 + Math.random() * 30}px`,
                    animationDuration: `${0.3 + Math.random() * 0.7}s`,
                    animationDelay: `${Math.random() * 1.5}s`,
                  }}
                />
              ))}

              {/* Rain Splash Effects */}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`splash-${i}`}
                  className="absolute bottom-0 left-0 w-2 h-1 bg-blue-300 rounded-full opacity-70 animate-splash"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${0.3 + Math.random() * 0.4}s`,
                    animationDelay: `${Math.random() * 2}s`,
                    transform: `scale(${0.5 + Math.random() * 0.5})`,
                  }}
                />
              ))}
            </>
          )}

        {/* Snowflakes */}
        {React.isValidElement(currentWeatherIcon) &&
          currentWeatherIcon.type === FiCloudSnow && (
            <>
              {[...Array(15)].map((_, i) => (
                <div
                  key={`snow-${i}`}
                  className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full opacity-80 animate-snow"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${3 + Math.random() * 3}s`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </>
          )}
      </div>

      {/* Verification Card */}
      <div className="w-full max-w-md z-10">
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          {/* Weather Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 py-6 px-8 relative">
            <div className="absolute top-4 right-4 flex items-center">
              <span className="text-gray-900 text-xl mr-2">{temperature}</span>
              <span className="text-gray-900 text-2xl">
                {currentWeatherIcon}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              WeatherSphere
            </h1>
            <p className="text-gray-900 text-opacity-80 text-center mt-1">
              Secure Verification
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <p className="text-center text-gray-300 text-sm mb-6">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-yellow-400">{email}</span>
            </p>

            {successMessage && (
              <div className="mb-6 p-3 bg-green-900 bg-opacity-30 text-green-300 rounded-lg text-sm flex items-center justify-center">
                <FiCheckCircle className="mr-2" />
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  OTP Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={handleChange}
                    maxLength="6"
                    className={`bg-gray-700 text-gray-200 w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-center tracking-widest text-xl ${
                      error ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
              >
                Verify Weather Account
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">
                    Didn't receive the code?
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={handleResend}
                  className={`font-medium text-yellow-500 hover:text-yellow-400 ${
                    resending ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={resending}
                >
                  {resending ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Resending...
                    </span>
                  ) : (
                    "Resend Weather Code"
                  )}
                </button>
                {resendMessage && (
                  <div className="text-green-400 mt-2 text-sm">
                    {resendMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
