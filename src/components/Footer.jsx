import React from "react";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Brand Section */}
                    <div>
                        <h2 className="text-xl font-bold text-[#ba7a4e]">
                            LMS Portal
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">
                            A smart Learning Management System for managing students, courses, and academic records efficiently.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 dark:text-zinc-200 mb-3">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                            <li className="hover:text-[#ba7a4e] cursor-pointer">Dashboard</li>
                            <li className="hover:text-[#ba7a4e] cursor-pointer">Students</li>
                            <li className="hover:text-[#ba7a4e] cursor-pointer">Courses</li>
                            <li className="hover:text-[#ba7a4e] cursor-pointer">Attendance</li>
                        </ul>
                    </div>

                    {/* Contact / Info */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 dark:text-zinc-200 mb-3">
                            Contact
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-zinc-400">
                            Email: support@lmsportal.com
                        </p>
                        <p className="text-sm text-gray-600 dark:text-zinc-400">
                            Phone: +92 300 1234567
                        </p>
                        <p className="text-sm text-gray-600 dark:text-zinc-400">
                            Location: Pakistan
                        </p>
                    </div>

                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-zinc-700 my-6"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-zinc-500">

                    <p>
                        © {new Date().getFullYear()} LMS Portal. All rights reserved.
                    </p>

                    <div className="flex gap-4 mt-3 md:mt-0">
                        <span className="hover:text-[#ba7a4e] cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-[#ba7a4e] cursor-pointer">Terms</span>
                        <span className="hover:text-[#ba7a4e] cursor-pointer">Support</span>
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;