import { FaBell } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle"

export default function Navbar({ studentInfo }) {
  const route = useLocation();
  const isStudentRoute = route.pathname.split("/")[1] === "student"
  const isTeacherRoute = route.pathname.split("/")[1] === "teacher"
  const isAdminRoute = route.pathname.split("/")[1] === "admin"
  const [toggleMenu, setToggleMenu] = useState(false);
  const [menu, setmenu] = useState(false)



  return (
    <>
      {
        isStudentRoute &&
        // <nav className="font-sans border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
        //   {/* Top Bar */}
        //   <div className="flex justify-between items-center px-6 lg:px-20 py-3">
        //     {/* Left Section - Logo and Name */}
        //     <div className="flex items-center gap-x-3">
        //       <img
        //         className="w-10 h-10 object-cover rounded-md shadow-sm"
        //         src="/logo.png"
        //         alt="UET Logo"
        //       />
        //       <div>
        //         <h1 className="text-gray-800 font-semibold text-lg tracking-wide">
        //           University of Engineering & Technology
        //         </h1>
        //         <p className="text-gray-500 text-sm">Student Portal</p>
        //       </div>
        //     </div>

        //     {/* Right Section - Notifications + Profile */}
        //     <div className="flex items-center gap-x-6">
        //       <div className="flex items-center gap-x-5 text-gray-600">
        //         <div className="relative group cursor-pointer">
        //           <FaBell
        //             size={18}
        //             className="hover:text-blue-600 transition-colors duration-200"
        //           />
        //           <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 rounded-full">
        //             3
        //           </span>
        //         </div>
        //         <div className="group cursor-pointer">
        //           <MdTipsAndUpdates
        //             size={20}
        //             className="hover:text-blue-600 transition-colors duration-200"
        //           />
        //         </div>
        //       </div>

        //       {/* Profile Dropdown */}

        //       <div className="relative">

        //         <button onBlur={() => {
        //           setTimeout(() => {
        //             setmenu(!menu);
        //           }, 300);
        //         }}
        //           onClick={() => {
        //             setmenu(!menu);
        //           }}
        //           id="dropdownUserAvatarButton" data-dropdown-toggle="dropdownAvatar" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" type="button">
        //           <span className="sr-only">Open user menu</span>
        //           <img className="w-8 h-8 rounded-full object-cover" src={studentInfo?.profileImage === 'none' ? "/profile.jpg" : studentInfo?.profileImage} alt="user photo" />
        //         </button>

        //         <div id="dropdownAvatar" className={`${menu ? "" : "hidden"} z-10 -left-20 top-10 absolute  bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600`}>
        //           <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
        //             <div>{studentInfo?.fullName}</div>
        //             <div className="font-medium truncate">{studentInfo?.email}</div>
        //           </div>
        //           <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
        //             <li>
        //               <Link to="/student/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</Link>
        //             </li>
        //             <li>
        //               <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
        //             </li>
        //             <li>
        //               <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
        //             </li>
        //           </ul>
        //           <div className="py-2">
        //             <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
        //           </div>
        //         </div>

        //       </div>

        //       <ThemeToggle />

        //     </div>
        //   </div>
        // </nav>
        <nav className="font-sans border-b border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f] bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-sm sticky top-0 z-50">
          {/* Top Bar */}
          <div className="flex justify-between items-center px-6 lg:px-20 py-3">

            {/* Left Section - Logo and Name */}
            <div className="flex items-center gap-x-3">
              <img
                className="w-10 h-10"
                src="/logo.png"
                alt="UET Logo"
              />
              <div>
                <h1 className="text-gray-800 dark:text-zinc-100 black:text-white font-semibold text-lg tracking-wide lg:block hidden">
                  University of Engineering & Technology
                </h1>
                <h1 className="text-gray-800 dark:text-zinc-100 black:text-white font-semibold text-lg tracking-wide block lg:hidden">
                  UET
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 black:text-[#555] text-sm">Student Portal</p>
              </div>
            </div>

            {/* Right Section - Notifications + Profile */}
            <div className="flex items-center gap-x-6">
              <div className="flex items-center gap-x-5 text-gray-600 dark:text-zinc-400 black:text-[#666]">

                {/* Bell */}
                <div className="relative group cursor-pointer">
                  <FaBell
                    size={18}
                    className="hover:text-[#ba7a4e] transition-colors duration-200"
                  />
                  <span className="absolute -top-1 -right-1 bg-[#ba7a4e] text-white text-[10px] px-1.5 rounded-full">
                    3
                  </span>
                </div>

                {/* Tips */}
                <div className="group cursor-pointer">
                  <MdTipsAndUpdates
                    size={20}
                    className="hover:text-[#ba7a4e] transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onBlur={() => { setTimeout(() => { setmenu(!menu); }, 200); }}
                  onClick={() => { setmenu(!menu); }}
                  id="dropdownUserAvatarButton"
                  data-dropdown-toggle="dropdownAvatar"
                  className="flex text-sm rounded-full focus:ring-4 focus:ring-[#ba7a4e]/30 dark:focus:ring-[#ba7a4e]/20"
                  type="button"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={studentInfo?.profileImage === "none" ? "/profile.jpg" : studentInfo?.profileImage}
                    alt="user photo"
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  id="dropdownAvatar"
                  className={`${menu ? "" : "hidden"} z-10 -left-20 top-10 absolute bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] divide-y divide-gray-100 dark:divide-zinc-700 black:divide-[#1f1f1f] rounded-lg shadow-lg border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] w-44`}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-zinc-100 black:text-white">
                    <div className="font-medium">{studentInfo?.fullName}</div>
                    <div className="text-gray-500 dark:text-zinc-400 black:text-[#555] truncate">{studentInfo?.email}</div>
                  </div>

                  {/* Links */}
                  <ul className="py-2 text-sm text-gray-700 dark:text-zinc-300 black:text-[#aaa]" aria-labelledby="dropdownUserAvatarButton">
                    <li>
                      <Link
                        to="/student/profile"
                        className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] transition-colors"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] transition-colors"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-[#ba7a4e] transition-colors"
                      >
                        Earnings
                      </a>
                    </li>
                  </ul>

                  {/* Sign Out */}
                  <div className="py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-50 dark:hover:bg-zinc-700 black:hover:bg-[#141414] hover:text-red-500 dark:hover:text-red-400 black:hover:text-red-500 transition-colors"
                    >
                      Sign out
                    </a>
                  </div>
                </div>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </nav>
      }{
        isAdminRoute &&
        <nav className="font-sans border-b border-gray-200 dark:border-zinc-700 black:border-[#1f1f1f] bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-sm sticky top-0 z-50">
          {/* Top Bar */}
          <div className="flex justify-between items-center px-6 lg:px-20 py-3">

            {/* Left Section - Logo and Name */}
            <div className="flex items-center gap-x-3">
              <img
                className="w-10 h-10"
                src="/logo.png"
                alt="UET Logo"
              />
              <div>
                <h1 className="text-gray-800 dark:text-zinc-100 black:text-white font-semibold text-lg tracking-wide">
                  Govt Islamia Graduate College Civil Lines
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 black:text-[#555] text-sm">Admin Portal</p>
              </div>
            </div>

            {/* Right Section - Notifications + Profile */}
            <div className="flex items-center gap-x-6">
              <div className="flex items-center gap-x-5 text-gray-600 dark:text-zinc-400 black:text-[#666]">

                {/* Bell */}
                <div className="relative group cursor-pointer">
                  <FaBell
                    size={18}
                    className="hover:text-[#ba7a4e] transition-colors duration-200"
                  />
                  <span className="absolute -top-1 -right-1 bg-[#ba7a4e] text-white text-[10px] px-1.5 rounded-full">
                    3
                  </span>
                </div>

                {/* Tips */}
                <div className="group cursor-pointer">
                  <MdTipsAndUpdates
                    size={20}
                    className="hover:text-[#ba7a4e] transition-colors duration-200"
                  />
                </div>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </nav>
      }
    </>
  );
}
