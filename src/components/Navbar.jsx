import { FaBell } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle"
import {
  HiOutlineChevronDown,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineCog6Tooth,
  HiOutlineBell,
  HiOutlineDocumentText,
  HiOutlineCalendarDays,
  HiOutlineArrowRightOnRectangle,
  HiOutlineSwatch,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineComputerDesktop,
} from "react-icons/hi2";
import {
  FaShieldAlt
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Navbar({ studentInfo, adminInfo, teacherInfo }) {
  const route = useLocation();
  const isStudentRoute = route.pathname.split("/")[1] === "student"
  const isTeacherRoute = route.pathname.split("/")[1] === "teacher"
  const isAdminRoute = route.pathname.split("/")[1] === "admin"
  const [toggleMenu, setToggleMenu] = useState(false);
  const [menu, setmenu] = useState(false)
  const navigate = useNavigate()

  let userType = ""
  isStudentRoute ? userType = "students"
    : isTeacherRoute ? userType = "teachers"
      : userType = "admin";


  const logout = async () => {
    try {
      const response = await axios.post(`/api/v1/${userType}/logout`,
        {},
        { withCredentials: true }
      );

      if (response?.data?.success) {
        Swal.fire({
          title: response?.data?.message,
          icon: "success",
          timer: 1500,
          showConfirmButton: true,
        });

        navigate(`/login`);
      }
    } catch (error) {
      Swal.fire({
        title: error?.response?.data?.message,
        text: "Please try again.",
        icon: "error",
      });
    }
  };



  return (
    <>
      {
        isStudentRoute &&
        <nav className="font-sans border-b border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f] bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-sm sticky top-0 z-50">
          <div className="flex justify-between items-center px-6 lg:px-20 py-3">

            <div className="flex items-center gap-x-3">
              <img className="w-10 h-10" src="/logo.png" alt="UET Logo" />
              <div>
                <h1 className="text-gray-800 dark:text-zinc-100 black:text-white font-semibold text-lg tracking-wide hidden md:block">
                  Govt Islamia Graduate College Civil Lines
                </h1>
                <h1 className="text-gray-800 dark:text-zinc-100 black:text-white font-semibold text-[20px] tracking-wide block md:hidden">
                  GIGCCL
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 black:text-[#555] hidden md:block text-sm">Student Portal</p>
                <p className="text-gray-500 dark:text-zinc-400 black:text-[#555] block md:hidden text-[12px]">Student Portal</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">

                <button
                  onClick={() => setmenu(!menu)}
                  onBlur={() => setTimeout(() => setmenu(false), 150)}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={menu}
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-150
            border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f]
            bg-white dark:bg-zinc-800 black:bg-[#0d0d0d]
            hover:border-gray-300 dark:hover:border-zinc-600 black:hover:border-[#2a2a2a]`}
                >
                  <img
                    className="w-7 h-7 rounded-full object-cover"
                    src={studentInfo?.profileImage ? studentInfo?.profileImage :  "/profile.jpg"}
                    alt="user photo"
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white hidden sm:block max-w-[90px] truncate">
                    {studentInfo?.fullName?.split(" ")[0]}
                  </span>
                  <HiOutlineChevronDown
                    size={13}
                    className={`text-gray-400 dark:text-zinc-500 transition-transform duration-200 ${menu ? "rotate-180" : ""}`}
                  />
                </button>

                {menu && (
                  <div className="absolute right-0 top-11 z-50 w-60
            bg-white dark:bg-zinc-800 black:bg-[#0d0d0d]
            border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]
            rounded-2xl overflow-hidden shadow-lg
            animate-in fade-in slide-in-from-top-1 duration-150"
                  >

                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                      <img
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-[#ba7a4e]/20"
                        src={studentInfo?.profileImage ? studentInfo?.profileImage :  "/profile.jpg"}
                        alt="user photo"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white truncate">
                          {studentInfo?.fullName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 black:text-[#555] truncate">
                          {studentInfo?.email}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-[#ba7a4e] bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 rounded-full px-2 py-0.5">
                          <HiOutlineAcademicCap size={10} />
                          {studentInfo?.degreeTitle} · {studentInfo?.shift}
                        </span>
                      </div>
                    </div>

                    <div className="py-1.5 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                      <Link
                        to="/student/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] group transition-colors"
                      >
                        <HiOutlineUser size={15} className="text-gray-400 dark:text-zinc-500 group-hover:text-[#ba7a4e] transition-colors" />
                        My Profile
                      </Link>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] group transition-colors"
                      >
                        <HiOutlineBell size={15} className="text-gray-400 dark:text-zinc-500 group-hover:text-[#ba7a4e] transition-colors" />
                        Notifications
                        <span className="ml-auto text-[10px] font-medium text-[#ba7a4e] bg-[#ba7a4e]/10 rounded-full px-2 py-0.5">3</span>
                      </a>
                      <Link
                        to={"/student/security"}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] group transition-colors"
                      >
                        <FaShieldAlt size={15} className="text-gray-400 dark:text-zinc-500 group-hover:text-[#ba7a4e] transition-colors" />
                        Security
                      </Link>
                      <div className="flex items-center gap-3 px-4 py-2">
                        <HiOutlineSwatch size={15} className="text-gray-400 dark:text-zinc-500 flex-shrink-0" />
                        <span className="flex-1 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa]">Theme</span>
                        <ThemeToggle />
                      </div>
                    </div>

                    <div className="py-1.5">
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 black:hover:bg-[#141414] transition-colors"
                      >
                        <HiOutlineArrowRightOnRectangle size={15} />
                        Sign out
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>

          </div>
        </nav>
      }{
        isAdminRoute &&
        <nav className="font-sans border-b border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f] bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-sm sticky top-0 z-50">
          <div className="flex justify-between items-center px-6 lg:px-20 py-3">
            <div className="flex items-center gap-x-3">
              <img
                className="w-10 h-10"
                src="/logo.png"
                alt="UET Logo"
              />
              <div>
                <h1 className="text-gray-800 dark:text-zinc-100 black:text-white font-semibold text-lg tracking-wide hidden md:block">
                  Govt Islamia Graduate College Civil Lines
                </h1>
                <h1 className="text-gray-800 dark:text-zinc-100 black:text-white font-semibold text-[20px] tracking-wide block md:hidden">
                  GIGCCL
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 black:text-[#555] hidden md:block text-sm">Admin Portal</p>
                <p className="text-gray-500 dark:text-zinc-400 black:text-[#555] block md:hidden text-[12px]">Admin Portal</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">

                <button
                  onClick={() => setmenu(!menu)}
                  onBlur={() => setTimeout(() => setmenu(false), 150)}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={menu}
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-150
            border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f]
            bg-white dark:bg-zinc-800 black:bg-[#0d0d0d]
            hover:border-gray-300 dark:hover:border-zinc-600 black:hover:border-[#2a2a2a]`}
                >
                  <img
                    className="w-7 h-7 rounded-full object-cover"
                    src={adminInfo?.profileImage ? adminInfo?.profileImage :  "/profile.jpg"}
                    alt="user photo"
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white hidden md:block max-w-[90px] truncate">
                    {adminInfo?.fullName?.split(" ")[0]}
                  </span>
                  <HiOutlineChevronDown
                    size={13}
                    className={`text-gray-400 dark:text-zinc-500 transition-transform duration-200 ${menu ? "rotate-180" : ""}`}
                  />
                </button>

                {menu && (
                  <div className="absolute right-0 top-11 z-50 w-60
            bg-white dark:bg-zinc-800 black:bg-[#0d0d0d]
            border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]
            rounded-2xl overflow-hidden shadow-lg
            animate-in fade-in slide-in-from-top-1 duration-150"
                  >

                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                      <img
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-[#ba7a4e]/20"
                        src={adminInfo?.profileImage ? adminInfo?.profileImage :  "/profile.jpg"}
                        alt="user photo"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white truncate">
                          {adminInfo?.fullName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 black:text-[#555] truncate">
                          {adminInfo?.email}
                        </p>
                      </div>
                    </div>

                    <div className="py-1.5 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                      <Link
                        to="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] group transition-colors"
                      >
                        <HiOutlineUser size={15} className="text-gray-400 dark:text-zinc-500 group-hover:text-[#ba7a4e] transition-colors" />
                        My Profile
                      </Link>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] group transition-colors"
                      >
                        <HiOutlineBell size={15} className="text-gray-400 dark:text-zinc-500 group-hover:text-[#ba7a4e] transition-colors" />
                        Notifications
                        <span className="ml-auto text-[10px] font-medium text-[#ba7a4e] bg-[#ba7a4e]/10 rounded-full px-2 py-0.5">3</span>
                      </a>
                      <Link
                        to={"/admin/security"}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] group transition-colors"
                      >
                        <FaShieldAlt size={15} className="text-gray-400 dark:text-zinc-500 group-hover:text-[#ba7a4e] transition-colors" />
                        Security
                      </Link>
                      <div className="flex items-center gap-3 px-4 py-2">
                        <HiOutlineSwatch size={15} className="text-gray-400 dark:text-zinc-500 flex-shrink-0" />
                        <span className="flex-1 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa]">Theme</span>
                        <ThemeToggle />
                      </div>
                    </div>

                    <div className="py-1.5">
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 black:hover:bg-[#141414] transition-colors"
                      >
                        <HiOutlineArrowRightOnRectangle size={15} />
                        Sign out
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      }
      {
        isTeacherRoute &&
        <nav className="font-sans border-b border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f] bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-sm sticky top-0 z-50">
          <div className="flex justify-between items-center px-6 lg:px-20 py-3">
            <div className="flex items-center gap-x-3">
              <img
                className="w-10 h-10"
                src="/logo.png"
                alt="UET Logo"
              />
              <div>
                <h1 className="text-gray-800 dark:text-zinc-100 black:text-white font-semibold text-lg tracking-wide hidden md:block">
                  Govt Islamia Graduate College Civil Lines
                </h1>
                <h1 className="text-gray-800 dark:text-zinc-100 black:text-white font-semibold text-[20px] tracking-wide block md:hidden">
                  GIGCCL
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 black:text-[#555] hidden md:block text-sm">Teacher Portal</p>
                <p className="text-gray-500 dark:text-zinc-400 black:text-[#555] block md:hidden text-[12px]">Teacher Portal</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">

                <button
                  onClick={() => setmenu(!menu)}
                  onBlur={() => setTimeout(() => setmenu(false), 150)}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={menu}
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-150
            border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f]
            bg-white dark:bg-zinc-800 black:bg-[#0d0d0d]
            hover:border-gray-300 dark:hover:border-zinc-600 black:hover:border-[#2a2a2a]`}
                >
                  <img
                    className="w-7 h-7 rounded-full object-cover"
                    src={teacherInfo?.profileImage ? teacherInfo?.profileImage :  "/profile.jpg"}
                    alt="user photo"
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white hidden md:block max-w-[90px] truncate">
                    {teacherInfo?.fullName?.split(" ")[0]}
                  </span>
                  <HiOutlineChevronDown
                    size={13}
                    className={`text-gray-400 dark:text-zinc-500 transition-transform duration-200 ${menu ? "rotate-180" : ""}`}
                  />
                </button>

                {menu && (
                  <div className="absolute right-0 top-11 z-50 w-60
            bg-white dark:bg-zinc-800 black:bg-[#0d0d0d]
            border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]
            rounded-2xl overflow-hidden shadow-lg
            animate-in fade-in slide-in-from-top-1 duration-150"
                  >

                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                      <img
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-[#ba7a4e]/20"
                        src={teacherInfo?.profileImage ? teacherInfo?.profileImage :  "/profile.jpg"}
                        alt="user photo"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white truncate">
                          {teacherInfo?.fullName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 black:text-[#555] truncate">
                          {teacherInfo?.email}
                        </p>
                      </div>
                    </div>

                    <div className="py-1.5 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                      <Link
                        to="/teacher/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] group transition-colors"
                      >
                        <HiOutlineUser size={15} className="text-gray-400 dark:text-zinc-500 group-hover:text-[#ba7a4e] transition-colors" />
                        My Profile
                      </Link>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] group transition-colors"
                      >
                        <HiOutlineBell size={15} className="text-gray-400 dark:text-zinc-500 group-hover:text-[#ba7a4e] transition-colors" />
                        Notifications
                        <span className="ml-auto text-[10px] font-medium text-[#ba7a4e] bg-[#ba7a4e]/10 rounded-full px-2 py-0.5">3</span>
                      </a>
                      <Link
                        to={"/teacher/security"}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] group transition-colors"
                      >
                        <FaShieldAlt size={15} className="text-gray-400 dark:text-zinc-500 group-hover:text-[#ba7a4e] transition-colors" />
                        Security
                      </Link>
                      <div className="flex items-center gap-3 px-4 py-2">
                        <HiOutlineSwatch size={15} className="text-gray-400 dark:text-zinc-500 flex-shrink-0" />
                        <span className="flex-1 text-sm text-gray-600 dark:text-zinc-300 black:text-[#aaa]">Theme</span>
                        <ThemeToggle />
                      </div>
                    </div>

                    <div className="py-1.5">
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 black:hover:bg-[#141414] transition-colors"
                      >
                        <HiOutlineArrowRightOnRectangle size={15} />
                        Sign out
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      }
    </>
  );
}




