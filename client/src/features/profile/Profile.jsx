import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser, FiMail, FiSettings, FiEdit, FiClock, FiLogOut } from "react-icons/fi";
import { FaUserCog, FaUserShield } from "react-icons/fa";
import { getProfile, updateProfile } from "../../api/profileApi"; // adjust path as needed

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch profile.");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    updateProfile(token, formData)
      .then((data) => {
        setProfile(data.user);
        setIsEditing(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to update profile.");
      });
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!profile) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">
            <span className="text-yellow-500">User</span> Profile
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md transition-colors"
          >
            <FiEdit className="mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="bg-black p-6 text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-yellow-400 flex items-center justify-center text-black mb-4">
                <FiUser size={48} />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400">{profile.name}</h2>
              <p className="text-gray-300">{profile.email}</p>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FiMail className="text-yellow-500 mr-3" size={20} />
                <span className="text-gray-700">{profile.email}</span>
              </div>
              <div className="flex items-center mb-4">
                <FaUserCog className="text-yellow-500 mr-3" size={20} />
                <span className="text-gray-700">Administrator</span>
              </div>
              <div className="flex items-center">
                <FiClock className="text-yellow-500 mr-3" size={20} />
                <span className="text-gray-700">Member since June 2023</span>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form or Details */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
                  <FiSettings className="mr-2 text-yellow-500" />
                  Edit Profile Information
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
                    <FaUserShield className="mr-2 text-yellow-500" />
                    Account Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-700">Account Status</h4>
                        <p className="text-sm text-gray-500">Active</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Verified
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-700">Last Login</h4>
                        <p className="text-sm text-gray-500">Today at 10:45 AM</p>
                      </div>
                      <FiClock className="text-yellow-500" />
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-700">Account Created</h4>
                        <p className="text-sm text-gray-500">June 15, 2023</p>
                      </div>
                      <FiUser className="text-yellow-500" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-black mb-4 flex items-center">
                    <FiSettings className="mr-2 text-yellow-500" />
                    Security
                  </h3>
                  <button className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="font-medium text-gray-700">Change Password</span>
                    <FiEdit className="text-yellow-500" />
                  </button>
                </div>

                <div className="border-t border-gray-200 p-6">
                  <button className="w-full flex justify-center items-center px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors">
                    <FiLogOut className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;