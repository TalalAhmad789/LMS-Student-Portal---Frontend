import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import axios from "axios";

// color thme: #ba7a4e

function App() {
  const route = useLocation();
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);

  const isStudentRoute = route.pathname.startsWith("/student");
  const isTeacherRoute = route.pathname.startsWith("/teacher");
  const isAdminRoute = route.pathname.startsWith("/admin");
  const isLoginPage = route.pathname === "/login";
  const isTeacherLoginPage = route.pathname === "/teacher-fe7$nf!fd7/login"
  const isAdminLoginPage = route.pathname === "/admin-bh$d!f74d4/login"

  useEffect(() => {
    const checkSession = async () => {
      if (isStudentRoute && !isLoginPage) {
        try {
          const res = await axios.get("/api/v1/students/me", { withCredentials: true });
          if (res?.data?.success) {
            setStudentInfo(res.data.data.student);
          } else {
            navigate("/login");
          }
        } catch (err) {
          navigate("/login");
        }
      }

      else if (isTeacherRoute && !isTeacherLoginPage) {
        try {
          const res = await axios.get('/api/v1/teachers/me', { withCredentials: true });
          if (res?.data?.success) {
            setTeacherInfo(res.data.data.teacher)
          }
          else {
            navigate("/login")
          }
        } catch (error) {
          navigate("/login")
        }
      }

      else if (isAdminRoute && !isAdminLoginPage) {
        try {
          const res = await axios.get('/api/v1/admin/me', { withCredentials: true });
          if (res?.data?.success) {
            setAdminInfo(res.data.data.admin)
          }
          else {
            navigate("/login")
          }
        } catch (error) {
          navigate("/login")
        }
      }
    };

    checkSession();
  }, [isStudentRoute, isLoginPage, navigate, isTeacherRoute, isAdminRoute, isTeacherLoginPage, isAdminLoginPage]);

  if (
    (isStudentRoute && !isLoginPage && !studentInfo) ||
    (isTeacherRoute && !isTeacherLoginPage && !teacherInfo) ||
    (isAdminRoute && !isAdminLoginPage && !adminInfo)
  ) {
    return <div></div>;
  }

  return (
    <div className="flex h-screen bg-[#f9fafb] dark:bg-gray-900 text-black dark:text-white">

      <Sidebar studentInfo={studentInfo} adminInfo={adminInfo} />

      <div className="flex flex-col flex-1 overflow-hidden">

        <Navbar studentInfo={studentInfo} adminInfo={adminInfo} teacherInfo={teacherInfo} />

        <div className="flex-1 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
          <Outlet context={{ studentInfo, teacherInfo, adminInfo }} />
        </div>

      </div>
    </div>
  );
}

export default App;