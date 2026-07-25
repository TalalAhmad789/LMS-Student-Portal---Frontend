import { useState, useEffect } from "react";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserFriends,
  FaWpforms,
  FaBookOpen,
  FaClock,
  FaBookReader,
  FaComments,
  FaEnvelope,
  FaShieldAlt,
  FaLaptop,
  FaSignOutAlt,
  FaClipboardList,
  FaUsersCog,
} from "react-icons/fa";
import axios from "axios";
import {
  MdGroups,
  MdOutlineAssignment,
  MdOutlineClass,
  MdOutlineMail,
  MdEventNote,
} from "react-icons/md";
import { GrAnnounce } from "react-icons/gr";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useToast } from '../hooks/useToast'

export default function Sidebar({ studentInfo, adminInfo }) {

  const { showSuccessToast, showErrorToast } = useToast()
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoute = location.pathname.split("/")[1];

  const menuItems = {
    student: [
      { name: "Dashboard", icon: <FaHome size={18} />, path: "/student/dashboard" },
      { name: "Academics", icon: <FaUserGraduate size={18} />, path: `/student/academics?semester=${studentInfo?.semester}` },
      { name: "Applications", icon: <FaWpforms size={18} />, path: "/student/applications" },
      { name: "Timetable", icon: <FaClock size={18} />, path: "/student/timetable" },
      { name: "Learning", icon: <FaBookReader size={18} />, path: "/student/learning" },
      { name: "Feedback", icon: <FaComments size={18} />, path: "/student/feedback" },
      { name: "Mailbox", icon: <FaEnvelope size={18} />, path: "/student/mailbox" },
      { name: "Access & Devices", icon: <FaLaptop size={18} />, path: "/student/access_and_devices" },
    ],

    admin: [
      { name: "Dashboard", icon: <FaHome size={18} />, path: "/admin/dashboard" },
      { name: "Students", icon: <FaUserGraduate size={18} />, path: "/admin/students" },
      { name: "Teachers", icon: <FaChalkboardTeacher size={18} />, path: "/admin/teachers" },
      ...(adminInfo?.isSuperAdmin ? [{ name: "Admins", icon: <MdGroups size={18} />, path: "/admin/admins" }] : []),
      { name: "Lecture", icon: <MdOutlineClass size={18} />, path: "/admin/lecture" },
      { name: "Course", icon: <FaBookOpen size={18} />, path: "/admin/course" },
      { name: "Promotion", icon: <GrAnnounce size={18} />, path: "/admin/promotion" },
      { name: "Applications", icon: <FaWpforms size={18} />, path: "/admin/applications" },
      { name: "Timetable", icon: <MdEventNote size={18} />, path: "/admin/timetable" },
      { name: "Attendance", icon: <FaClipboardList size={18} />, path: "/admin/attendance" },
      { name: "Assignments", icon: <MdOutlineAssignment size={18} />, path: "/admin/assignments" },
      { name: "Settings", icon: <FaUsersCog size={18} />, path: "/admin/settings" }
    ],

    teacher: [
      { name: "Dashboard", icon: <FaHome size={18} />, path: "/teacher/dashboard" },
      { name: "Attendance", icon: <FaClipboardList size={18} />, path: "/teacher/attendance" }
    ],
  };

  const hideSidebarRoutes = ["/", "/student/login", "/teacher/login", "/admin/login"];
  if (hideSidebarRoutes.includes(location.pathname)) return null;

  const userType =
    currentRoute === "student" || currentRoute === "admin" || currentRoute === "teacher"
      ? currentRoute
      : null;

  if (!userType) return null;

  const currentMenu = menuItems[userType];
  const portalTitle = userType.charAt(0).toUpperCase() + userType.slice(1) + " Portal";

  const logout = async () => {
    try {
      const response = await axios.post(userType === "admin" ? `/api/v1/${userType}/logout` : `/api/v1/${userType}s/logout`,
        {},
        { withCredentials: true }
      );

      if (response?.data?.success) {
        showSuccessToast(response?.data?.message);
        userType === 'admin' ? navigate('/a-bh$d!f74d4/login') : userType === 'teacher' ? navigate('/t-fe7$nf!fd7/login') : navigate('/login');
      }
    } catch (error) {
      showErrorToast(error.response.data.message || "Something went wrong!");
    }
  };

  return (

    <aside className="h-screen w-[240px] bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] border-r border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm flex flex-col">

      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f] flex-shrink-0">
        <img src="/logo.png" alt="LMS Logo" className="w-9 h-9" />
        <h1 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 black:text-white">
          {portalTitle}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <nav className="mt-4 flex flex-col gap-1 pb-6">
          {currentMenu.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-[#ba7a4e]/10 text-[#ba7a4e] border-[#ba7a4e]"
                  : "text-gray-700 dark:text-zinc-400 black:text-[#aaa] hover:bg-gray-100 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e]"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f] flex-shrink-0">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 text-gray-600 dark:text-zinc-400 black:text-[#666] hover:text-red-500 dark:hover:text-red-400 black:hover:text-red-500 transition-all duration-200"
        >
          <FaSignOutAlt size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

    </aside>
  );
}
