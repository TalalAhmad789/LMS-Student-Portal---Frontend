import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, Bounce } from 'react-toastify';
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from '../hooks/useToast'

const AdminLogin = () => {

  const { showSuccessToast, showErrorToast } = useToast();

  const navigate = useNavigate();
  const route = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [is30Days, setis30Days] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    let newErrors = {}

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelay = (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, t * 1000);
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      email: form.email,
      password: form.password,
      checkbox: is30Days,
    };

    try {
      setLoading(true);
      await handleDelay(2);

      const response = await axios.post('/api/v1/admin/login', payload, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        showSuccessToast(response.data.message)
        navigate("/admin/dashboard");
      }
    } catch (error) {
      showErrorToast(error.response.data.message || "Something went wrong!")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const response = await axios.get('/api/v1/admin/me', { withCredentials: true });
      if (response?.data?.success) {
        navigate('/admin/dashboard')
      }
    }
    checkAuth();
  }, [])


  return (
    <div className="bg-[url(/bg-back.jpg)] min-h-screen flex items-center justify-center py-10 px-4 overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 black:bg-[#0d0d0d]/95 border border-white/40 dark:border-zinc-700/60 black:border-[#1f1f1f] shadow-2xl rounded-3xl overflow-hidden">

          <div className="h-[3px] bg-[#ba7a4e]" />

          <div className="p-8">

            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center shadow-sm">
                  <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">
                LMS Portal Login
              </h1>
              <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888] mt-1.5">
                Sign in as{" "}
                <span className="text-[#ba7a4e] font-semibold capitalize">Admin</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  className="h-[42px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-800 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-[42px] w-full px-3 pr-16 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-800 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 ${errors.password ? "top-1/3" : "top-1/2"} -translate-y-1/2 text-xs font-medium text-[#ba7a4e] hover:text-[#a06840] transition`}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={is30Days}
                    onChange={(e) => setis30Days(e.target.checked)}
                    className="w-4 h-4 accent-[#ba7a4e]"
                  />
                  <span className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#888]">Remember for 30 days</span>
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-[#ba7a4e] hover:text-[#a06840] hover:underline transition"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-[42px] flex items-center justify-center bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-150 mt-2"
              >
                {loading ? "Please wait..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;