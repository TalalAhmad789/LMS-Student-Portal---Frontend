import React, { useState } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";
import { FiLock, FiKey } from "react-icons/fi";

const Security = () => {

  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    retype_password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleDelay = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay * 1000));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleDelay(3);
    try {
      const response = await axios.post("/api/v1/students/change-password", password, {
        withCredentials: true
      });

      Swal.fire({
        title: response?.data?.message,
        icon: "success",
        draggable: true
      });

      setPassword({
        current_password: "",
        new_password: "",
        retype_password: ""
      });
    } catch (error) {
      Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6 pt-10 pb-24">

      {/* CARD */}
      <div className="backdrop-blur-xl bg-white/60 shadow-2xl rounded-2xl p-10 w-full max-w-lg border border-gray-200">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full mb-3 shadow-inner">
            <FiLock className="text-blue-600 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Security Settings
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Update your password to keep your account protected.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* INPUT FIELD */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-800 mb-1">Current Password</label>
            <div className="relative">
              <FiKey className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type="text"
                name="current_password"
                value={password.current_password}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full pl-10 pr-3 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-800 mb-1">New Password</label>
            <div className="relative">
              <FiKey className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type="text"
                name="new_password"
                value={password.new_password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full pl-10 pr-3 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-800 mb-1">Re-type Password</label>
            <div className="relative">
              <FiKey className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type="text"
                name="retype_password"
                value={password.retype_password}
                onChange={handleChange}
                placeholder="Re-type new password"
                className="w-full pl-10 pr-3 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Security;
