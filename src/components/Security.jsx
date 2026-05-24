import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";
import { FiLock, FiKey } from "react-icons/fi";
import { HiOutlineKey, HiOutlineShieldCheck } from "react-icons/hi2";
import { useLocation } from 'react-router-dom'

const Security = () => {

   const getTheme = () => {
      if (document.documentElement.classList.contains("dark")) return "dark";
      return "light";
    };
  
    const [theme, setTheme] = useState(getTheme);
  
    useEffect(() => {
      const observer = new MutationObserver(() => {
        setTheme(getTheme());
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    }, []);
  
    const isDark = theme === "dark";


  const route = useLocation()
  const currentRoute = route.pathname.split("/")[1]
  const userType = currentRoute === "admin" ? "admin" : currentRoute === "student" ? "student" : "teacher";

  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    retype_password: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({})

  const handleDelay = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay * 1000));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!password?.current_password?.trim()) {
      newErrors.current_password = "Current password is required"
    }

    if (!password?.new_password?.trim()) {
      newErrors.new_password = "New Password is required";
    }
    else if (password.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters long";
    }
    else if (!/[A-Z]/.test(password.new_password)) {
      newErrors.new_password = "Must contain at least 1 uppercase letter";
    }
    else if (!/[a-z]/.test(password.new_password)) {
      newErrors.new_password = "Must contain at least 1 lowercase letter";
    }
    else if (!/[0-9]/.test(password.new_password)) {
      newErrors.new_password = "Must contain at least 1 number";
    }
    else if (!/[@$!%*?&]/.test(password.new_password)) {
      newErrors.new_password = "Must contain at least 1 special character (@$!%*?&)";
    } else if (password.new_password === password.current_password) {
      newErrors.new_password = "Password already used in current password"
    }

    if (!password?.retype_password?.trim()) {
      newErrors.retype_password = "Re-type password is required";
    }
    else if (password.retype_password !== password.new_password) {
      newErrors.retype_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await handleDelay(3);
    try {
      const response = await axios.post(userType === "admin" ? `/api/v1/${userType}/change-password` : `/api/v1/${userType}s/change-password`, password, {
        withCredentials: true
      });

      if (response?.data?.success) {
        Swal.fire({
          title: response?.data?.message,
          icon: "success",
          draggable: true,
          theme: isDark ? "dark" : "light"
        });

        setPassword({
          current_password: "",
          new_password: "",
          retype_password: ""
        });
      }

    } catch (error) {
      Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
        draggable: true,
        theme: isDark ? "dark" : "light"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-[3px] bg-[#ba7a4e]" />
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-zinc-800 black:bg-[#0d0d0d]
        border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]
        rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8">

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] mb-4">
                <FiLock size={20} />
              </div>
              <h2 className="text-lg font-medium text-gray-800 dark:text-zinc-100 black:text-white">
                Security Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888] mt-1">
                Update your password to keep your account protected.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="current_password"
                  className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]"
                >
                  Current Password
                </label>
                <div className="relative">
                  <HiOutlineKey
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none"
                  />
                  <input
                    id="current_password"
                    type="password"
                    name="current_password"
                    value={password.current_password}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className="w-full h-[42px] pl-9 pr-4 text-sm
                    bg-gray-50 dark:bg-zinc-700/50 black:bg-[#141414]
                    border border-gray-200 dark:border-zinc-700 black:border-[#2a2a2a]
                    text-gray-800 dark:text-zinc-100 black:text-white
                    placeholder-gray-400 dark:placeholder-zinc-600 black:placeholder-[#444]
                    rounded-lg outline-none transition-all duration-150
                    focus:border-[#ba7a4e] focus:bg-white dark:focus:bg-zinc-700 black:focus:bg-[#1a1a1a]
                    focus:ring-2 focus:ring-[#ba7a4e]/15"
                  />
                </div>
                {errors.current_password && <p className="text-red-500 text-[12px]">{errors.current_password}</p>}
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]" />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="new_password"
                  className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]"
                >
                  New Password
                </label>
                <div className="relative">
                  <HiOutlineKey
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none"
                  />
                  <input
                    id="new_password"
                    type="password"
                    name="new_password"
                    value={password.new_password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full h-[42px] pl-9 pr-4 text-sm
                    bg-gray-50 dark:bg-zinc-700/50 black:bg-[#141414]
                    border border-gray-200 dark:border-zinc-700 black:border-[#2a2a2a]
                    text-gray-800 dark:text-zinc-100 black:text-white
                    placeholder-gray-400 dark:placeholder-zinc-600 black:placeholder-[#444]
                    rounded-lg outline-none transition-all duration-150
                    focus:border-[#ba7a4e] focus:bg-white dark:focus:bg-zinc-700 black:focus:bg-[#1a1a1a]
                    focus:ring-2 focus:ring-[#ba7a4e]/15"
                  />
                </div>
                {errors.new_password && <p className="text-red-500 text-[12px]">{errors.new_password}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="retype_password"
                  className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]"
                >
                  Re-type Password
                </label>
                <div className="relative">
                  <HiOutlineKey
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none"
                  />
                  <input
                    id="retype_password"
                    type="password"
                    name="retype_password"
                    value={password.retype_password}
                    onChange={handleChange}
                    placeholder="Re-type new password"
                    className="w-full h-[42px] pl-9 pr-4 text-sm
                    bg-gray-50 dark:bg-zinc-700/50 black:bg-[#141414]
                    border border-gray-200 dark:border-zinc-700 black:border-[#2a2a2a]
                    text-gray-800 dark:text-zinc-100 black:text-white
                    placeholder-gray-400 dark:placeholder-zinc-600 black:placeholder-[#444]
                    rounded-lg outline-none transition-all duration-150
                    focus:border-[#ba7a4e] focus:bg-white dark:focus:bg-zinc-700 black:focus:bg-[#1a1a1a]
                    focus:ring-2 focus:ring-[#ba7a4e]/15"
                  />
                </div>
                {errors.retype_password && <p className="text-red-500 text-[12px]">{errors.retype_password}</p>}
              </div>

              <button
                type="submit"
                className="mt-2 w-full h-[42px] flex items-center justify-center gap-2
                bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98]
                text-white text-sm font-medium rounded-lg
                transition-all duration-150"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Security;





