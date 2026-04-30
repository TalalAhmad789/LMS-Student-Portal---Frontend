import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const route = useLocation();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [is30Days, setis30Days] = useState(false);
  const [loading, setLoading] = useState(false);

  const isStudentRoute = route.pathname.startsWith("/student");
  const isTeacherRoute = route.pathname.startsWith("/teacher");
  const isAdminRoute = route.pathname.startsWith("/admin");

  const [form, setForm] = useState({
    loginId: "",
    password: "",
  });

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

  const getApiConfig = () => {
    switch (role) {
      case "student":
        return {
          loginUrl: "/api/v1/students/login",
          meUrl: "/api/v1/students/me",
          dashboard: "/student/dashboard",
          fieldName: "studentId",
        };
      case "teacher":
        return {
          loginUrl: "/api/v1/teachers/login",
          meUrl: "/api/v1/teachers/me",
          dashboard: "/teacher/dashboard",
          fieldName: "teacherId",
        };
      case "admin":
        return {
          loginUrl: "/api/v1/admin/login",
          meUrl: "/api/v1/admin/me",
          dashboard: "/admin/dashboard",
          fieldName: "email",
        };
      default:
        return {};
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { loginUrl, dashboard, fieldName } = getApiConfig();

    const payload = {
      [fieldName]: form.loginId,
      password: form.password,
      checkbox: is30Days,
    };

    try {
      setLoading(true);
      await handleDelay(2);

      const response = await axios.post(loginUrl, payload, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        Swal.fire({
          title: response.data.message,
          icon: "success",
        });

        navigate(dashboard);
      }
    } catch (error) {
      Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10 px-4 bg-gradient-to-br from-[#8B5CF6] via-purple-700 to-indigo-900 overflow-hidden">

      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/95 border border-white/40 shadow-2xl rounded-3xl p-8">

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.png"
                alt="logo"
                className="w-16 h-16 rounded-2xl shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              LMS Portal Login
            </h1>
            <p className="text-gray-500 mt-2">
              Sign in as{" "}
              <span className="text-[#925fe2] font-semibold capitalize">
                {role}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select User
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#925fe2] focus:outline-none transition"
              >
                <option value="student">🎓 Student</option>
                <option value="teacher">👨‍🏫 Teacher</option>
                <option value="admin">🛡️ Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {role === "admin"
                  ? "Email Address"
                  : `${role.charAt(0).toUpperCase() + role.slice(1)} ID`}
              </label>
              <input
                type="text"
                name="loginId"
                value={form.loginId}
                onChange={handleChange}
                placeholder={`Enter your ${role === "admin" ? "email" : role + " ID"
                  }`}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#925fe2] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#925fe2] focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-sm font-medium text-[#925fe2] hover:text-purple-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={is30Days}
                  onChange={(e) => setis30Days(e.target.checked)}
                  className="w-4 h-4 accent-[#925fe2]"
                />
                <span className="text-gray-600">Remember for 30 days</span>
              </label>

              <button
                type="button"
                className="text-[#925fe2] hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#925fe2] to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;