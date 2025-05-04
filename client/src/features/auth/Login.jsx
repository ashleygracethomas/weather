// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import loginApi from "../../api/loginApi";
import { useNavigate } from "react-router-dom";
import {
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiSun,
  FiCloud,
  FiCloudRain,
  FiCloudSnow,
} from "react-icons/fi";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState(<FiSun />);
  const [temperature, setTemperature] = useState("72°F");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }

    // Rotate weather icons for visual interest
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
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const result = await loginApi(formData.email, formData.password);
      if (result.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        navigate("/dashboard");
      } else {
        setApiError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      {/* Animated Weather Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Sun */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-400 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-pulse"></div>

        {/* Clouds */}
        <div className="absolute top-1/4 left-1/4 w-32 h-12 bg-gray-300 rounded-full opacity-10 animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-40 h-14 bg-gray-400 rounded-full opacity-10 animate-float animation-delay-2000"></div>

        {/* Enhanced Rain Animation - only visible when rain icon is active */}
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

        {/* Snowflakes - only visible when snow icon is active */}
        {React.isValidElement(currentWeatherIcon) &&
          currentWeatherIcon.type === FiCloudSnow && (
            <>
              <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white rounded-full opacity-80 animate-snow"></div>
              <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white rounded-full opacity-80 animate-snow animation-delay-500"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full opacity-80 animate-snow animation-delay-700"></div>
            </>
          )}
      </div>

      {/* Login Card */}
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
              Your personal weather companion
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {apiError && (
              <div className="mb-6 p-3 bg-red-900 bg-opacity-30 text-red-300 rounded-lg text-sm flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-yellow-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@weather.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`bg-gray-700 text-gray-200 w-full pl-10 pr-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>
{/* hjgg */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`bg-gray-700 text-gray-200 w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.password ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <FiEye className="h-5 w-5 text-yellow-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900"
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
                      Checking the forecast...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-900 bg-opacity-70 px-8 py-4 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              Don't have an account?
              <br />
              <a
                href="/signup"
                className="text-yellow-500 hover:text-yellow-400 font-medium"
              >
                Sign up for weather alerts
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Add these styles for the animated weather elements */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(20px) translateY(-10px);
          }
          100% {
            transform: translateX(0) translateY(0);
          }
        }
        @keyframes rain {
          0% {
            transform: translateY(-100px) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(10px);
            opacity: 0;
          }
        }
        @keyframes rain-streak {
          0% {
            transform: translateY(-150px) translateX(0) skewX(10deg);
            opacity: 0;
          }
          20% {
            opacity: 0.7;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) translateX(15px) skewX(10deg);
            opacity: 0;
          }
        }
        @keyframes splash {
          0% {
            transform: scale(0.1);
            opacity: 0;
          }
          30% {
            opacity: 0.6;
            transform: scale(1);
          }
          70% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.1);
          }
        }
        @keyframes snow {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(20px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-rain {
          animation: rain linear infinite;
        }
        .animate-rain-streak {
          animation: rain-streak linear infinite;
        }
        .animate-splash {
          animation: splash ease-out infinite;
        }
        .animate-snow {
          animation: snow 3s linear infinite;
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
