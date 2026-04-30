import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom"
import Swal from 'sweetalert2'
import { useNavigate, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";

const AttendanceMark = () => {

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

    const navigate = useNavigate()

    const [searchParams] = useSearchParams();

    const degree = searchParams.get("degree");
    const section = searchParams.get("section");
    const shift = searchParams.get("shift");
    const courseCode = searchParams.get("courseCode");
    const semester = searchParams.get("semester");
    const lectureAttendanceId = searchParams.get("lectureAttendanceId") || null;
    const [studentsData, setStudentsData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const fetchStudents = async () => {
            try {
                const response = await axios.get('/api/v1/teachers/attendance', {
                    params: {
                        degree: degree,
                        section: section,
                        shift: shift,
                        semester: semester
                    }
                })

                if (response?.data?.success) {
                    const data = response.data.data.students;

                    const lectureAttendanceId = uuidv4();

                    const formatted = data.map((item, index) => ({
                        collegeRollNo: item.collegeRollNo,
                        fullName: item.fullName,
                        studentId: item.studentId,
                        attendance: "Absent",
                        courseCode: courseCode,
                        semester: semester,
                        shift: shift,
                        degreeTitle: degree,
                        section: section,
                        lectureAttendanceId: lectureAttendanceId
                    }))
                    setStudentsData(formatted);
                }

            } catch (error) {
                console.log("Error fetching students:", error?.response?.data?.message);
            }
        }

        const editFetchStudents = async () => {
            try {
                const response = await axios.get('/api/v1/teachers/attendance/edit/fetch', {
                    params: {
                        degreeTitle: degree,
                        section: section,
                        shift: shift,
                        semester: semester,
                        courseCode: courseCode,
                        lectureAttendanceId: lectureAttendanceId
                    }
                })
                if (response?.data?.success) {
                    const data = response.data.data.attendance;
                    setStudentsData(data);
                }
            } catch (error) {
                console.log("Error fetching edit students:", error?.response?.data?.message);
            }
        }

        if (lectureAttendanceId === null) {
            fetchStudents()
        } else {
            editFetchStudents()
        }
    }, [])

    const toggleAttendance = (rollNo) => {
        setStudentsData((prev) =>
            prev.map((item) => {
                if (item.collegeRollNo === rollNo) {
                    const nextStatus =
                        item.attendance === "Absent"
                            ? "Present"
                            : item.attendance === "Present"
                                ? "Leave"
                                : "Absent";
                    return { ...item, attendance: nextStatus };
                }
                return item;
            })
        );
    };

    const total = studentsData.length;
    const present = studentsData.filter((s) => s.attendance === "Present").length;
    const leave = studentsData.filter((s) => s.attendance === "Leave").length;
    const absent = studentsData.filter((s) => s.attendance === "Absent").length;

    const handleDelay = async (t) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, t * 1000);
        })
    }

    const handleSubmit = async () => {

        try {

            setLoading(true)
            await handleDelay(5)

            const response = await axios.post('/api/v1/teachers/attendance/students', studentsData, { withCredentials: true });

            if (response?.data?.success) {
                await Swal.fire({
                    title: response?.data?.message,
                    icon: "success",
                    draggable: true,
                    theme: isDark ? "dark" : "light"
                });
                navigate('/teacher/dashboard');
            }
        } catch (error) {
            Swal.fire({
                title: error?.response?.data?.message,
                icon: "error",
                draggable: true,
                theme: isDark ? "dark" : "light"
            });
        } finally {
            setLoading(false)
        }

    };

    const handleUpdate = async () => {

        try {

            setLoading(true)
            await handleDelay(5)

            await axios.post('/api/v1/teachers/attendance/edit/update', studentsData, { withCredentials: true }).then(async (response) => {

                await Swal.fire({
                    title: response?.data?.message,
                    icon: "success",
                    draggable: true,
                    theme: isDark ? "dark" : "light"
                });

                navigate('/teacher/dashboard')

            }).catch((error) => {
                Swal.fire({
                    title: error?.response?.data?.message,
                    icon: "error",
                    draggable: true,
                    theme: isDark ? "dark" : "light"
                });
            })

        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 black:bg-black flex flex-col items-center py-10 px-4">

            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-zinc-100 black:text-white">
                Student Attendance
            </h1>

            {/* Stat Cards */}
            <div className="flex flex-wrap gap-16 justify-center mb-8">
                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-md rounded-xl p-4 w-48 text-center border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-zinc-400 black:text-[#555]">
                        Total Students
                    </h2>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 black:text-blue-500">{total}</p>
                </div>

                <div className="bg-green-100 dark:bg-green-400/10 black:bg-green-500/10 shadow-md rounded-xl p-4 w-48 text-center border border-transparent dark:border-green-400/20 black:border-green-500/20">
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-zinc-400 black:text-[#555]">Present</h2>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 black:text-green-500">{present}</p>
                </div>

                <div className="bg-yellow-100 dark:bg-yellow-400/10 black:bg-yellow-500/10 shadow-md rounded-xl p-4 w-48 text-center border border-transparent dark:border-yellow-400/20 black:border-yellow-500/20">
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-zinc-400 black:text-[#555]">Leave</h2>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 black:text-yellow-500">{leave}</p>
                </div>

                <div className="bg-red-100 dark:bg-red-400/10 black:bg-red-500/10 shadow-md rounded-xl p-4 w-48 text-center border border-transparent dark:border-red-400/20 black:border-red-500/20">
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-zinc-400 black:text-[#555]">Absent</h2>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400 black:text-red-500">{absent}</p>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-lg rounded-2xl w-[70vw] p-6 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-zinc-700/60 black:bg-[#141414] text-gray-700 dark:text-zinc-300 black:text-[#555] text-sm uppercase tracking-wide text-left">
                            <th className="p-3 rounded-tl-lg">Roll No</th>
                            <th className="p-3">Name</th>
                            <th className="p-3 rounded-tr-lg text-center">Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsData.length > 0 ? studentsData.map((s, index) => (
                            <tr key={index} className="border-b border-gray-100 dark:border-zinc-700 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/40 black:hover:bg-[#141414] transition-colors">
                                <td className="p-3 font-semibold text-[#ba7a4e]">{s.collegeRollNo}</td>
                                <td className="p-3 font-medium text-gray-800 dark:text-zinc-200 black:text-[#ccc]">{s.fullName}</td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => toggleAttendance(s.collegeRollNo)}
                                        className={`text-white px-4 py-2 w-32 rounded-lg font-semibold transition-all ${s.attendance === "Present"
                                            ? "bg-green-400 hover:bg-green-500 dark:bg-green-500/30 dark:hover:bg-green-500/50 dark:text-green-300 black:bg-green-500/20 black:hover:bg-green-500/40 black:text-green-400"
                                            : s.attendance === "Absent"
                                                ? "bg-red-400 hover:bg-red-500 dark:bg-red-500/30 dark:hover:bg-red-500/50 dark:text-red-300 black:bg-red-500/20 black:hover:bg-red-500/40 black:text-red-400"
                                                : "bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500/30 dark:hover:bg-yellow-500/50 dark:text-yellow-300 black:bg-yellow-500/20 black:hover:bg-yellow-500/40 black:text-yellow-400"
                                            }`}
                                    >
                                        {s.attendance}
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr className="border-b border-gray-100 dark:border-zinc-700 black:border-[#1a1a1a]">
                                <td className="text-center"></td>
                                <td className="text-center py-4 text-gray-400 dark:text-zinc-500 black:text-[#333]">No record found!!!</td>
                                <td className="text-center"></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Submit Button */}
            <button
                onClick={lectureAttendanceId === null ? handleSubmit : handleUpdate}
                className="mt-8 bg-[#ba7a4e] hover:bg-[#a06840] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow"
            >
                {loading ? "Loading..." : "Submit Attendance"}
            </button>
        </div>
    )
}

export default AttendanceMark