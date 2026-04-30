import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { useSearchParams, useNavigate } from "react-router-dom";

const EditAttendance = () => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([])
    const [searchParams] = useSearchParams()
    const degree = searchParams.get("degree");
    const section = searchParams.get("section");
    const shift = searchParams.get("shift");
    const courseCode = searchParams.get("courseCode");
    const semester = searchParams.get("semester");

    useEffect(() => {
        const getAttendance = async () => {
            try {
                const response = await axios.get('/api/v1/teachers/attendance/find', {
                    params: {
                        degreeTitle: degree,
                        section: section,
                        shift: shift,
                        courseCode: courseCode,
                        semester: semester
                    }
                })
                if (response?.data?.success) {
                    setAttendance(response?.data?.data?.attendance);
                }
            } catch (error) {
                console.log(error?.response?.data?.message);
            }
        }
        getAttendance()
    }, [])


    return (
        // <div className="p-6 max-w-6xl mx-auto">

        //     {/* Header */}
        //     <div className="mb-6">
        //         <h1 className="text-2xl font-bold text-gray-800">
        //             📅 Edit Attendance
        //         </h1>
        //         <p className="text-sm text-gray-500">
        //             View and update attendance records easily.
        //         </p>
        //     </div>

        //     {/* Table Card */}
        //     <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

        //         <table className="w-full text-left border-collapse">

        //             {/* Table Head */}
        //             <thead>
        //                 <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
        //                     <th className="p-4">Date</th>
        //                     <th className="p-4">Time</th>
        //                     <th className="p-4">Attendance</th>
        //                     <th className="p-4 text-center">Action</th>
        //                 </tr>
        //             </thead>

        //             {/* Table Body */}
        //             <tbody>
        //                 {attendance.length === 0 ? (
        //                     <tr>
        //                         <td colSpan="3" className="text-center p-6 text-gray-500">
        //                             No Attendance Found
        //                         </td>
        //                     </tr>
        //                 ) : (
        //                     attendance.map((item, index) => (
        //                         <tr
        //                             key={index}
        //                             className="border-t hover:bg-gray-50 transition"
        //                         >

        //                             {/* Date */}
        //                             <td className="p-4 font-medium text-gray-800">
        //                                 {item.date}
        //                             </td>

        //                             {/* Time */}
        //                             <td className="p-4 font-medium text-gray-800">
        //                                 {item.time}
        //                             </td>

        //                             {/* Attendance */}
        //                             <td className="p-4">
        //                                 <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
        //                                     {item.Attendance}
        //                                 </span>
        //                             </td>

        //                             {/* Edit Button */}
        //                             <td className="p-4 text-center">
        //                                 <button
        //                                     onClick={() => {
        //                                         navigate(`/teacher/attendance/submit?degree=${degree}&section=${section}&shift=${shift}&courseCode=${courseCode}&semester=${semester}&lectureAttendanceId=${item?.lectureAttendanceId}`)
        //                                     }}
        //                                     className="flex items-center gap-2 mx-auto bg-[#925fe2] text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">
        //                                     <FaEdit />
        //                                     Edit
        //                                 </button>
        //                             </td>

        //                         </tr>
        //                     ))
        //                 )}
        //             </tbody>

        //         </table>
        //     </div>
        // </div>
        <div className="p-6 max-w-6xl mx-auto bg-gray-50 dark:bg-zinc-900 black:bg-black min-h-screen">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 black:text-white">
                    📅 Edit Attendance
                </h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">
                    View and update attendance records easily.
                </p>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-xl rounded-2xl overflow-x-auto border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">



                <table className="w-full text-left border-collapse">

                    {/* Table Head */}
                    <thead>
                        <tr className="bg-gray-100 dark:bg-zinc-700/60 black:bg-[#141414] text-gray-700 dark:text-zinc-300 black:text-[#555] text-sm uppercase tracking-wide">
                            <th className="p-4">Date</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Attendance</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {attendance.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center p-6 text-gray-400 dark:text-zinc-500 black:text-[#333]">
                                    No Attendance Found
                                </td>
                            </tr>
                        ) : (
                            attendance.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-100 dark:border-zinc-700 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/40 black:hover:bg-[#141414] transition-colors"
                                >
                                    {/* Date */}
                                    <td className="p-4 font-semibold text-[#ba7a4e]">
                                        {item.date}
                                    </td>

                                    {/* Time */}
                                    <td className="p-4 font-medium text-gray-800 dark:text-zinc-200 black:text-[#ccc]">
                                        {item.time}
                                    </td>

                                    {/* Attendance Badge */}
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
                      ${item.Attendance === "Present"
                                                ? "bg-green-100 dark:bg-green-400/10 black:bg-green-500/10 text-green-700 dark:text-green-400 black:text-green-500"
                                                : item.Attendance === "Absent"
                                                    ? "bg-red-100 dark:bg-red-400/10 black:bg-red-500/10 text-red-600 dark:text-red-400 black:text-red-500"
                                                    : "bg-yellow-100 dark:bg-yellow-400/10 black:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 black:text-yellow-500"
                                            }`}>
                                            {item.Attendance}
                                        </span>
                                    </td>

                                    {/* Edit Button */}
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => {
                                                navigate(`/teacher/attendance/submit?degree=${degree}&section=${section}&shift=${shift}&courseCode=${courseCode}&semester=${semester}&lectureAttendanceId=${item?.lectureAttendanceId}`)
                                            }}
                                            className="flex items-center gap-2 mx-auto bg-[#ba7a4e] hover:bg-[#a06840] text-white px-4 py-2 rounded-lg shadow transition">
                                            <FaEdit />
                                            Edit
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default EditAttendance;