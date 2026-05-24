import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom"
import Swal from 'sweetalert2'
import { useNavigate, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";
import { MdChecklist } from "react-icons/md";

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
        <>
            <div className="w-full h-[3px] bg-[#ba7a4e]" />
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen">

                <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
                        <MdChecklist size={22} />
                    </span>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Student Attendance</h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
                            Mark and manage student attendance for the current lecture.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total", value: total, color: "text-[#ba7a4e]" },
                        { label: "Present", value: present, color: "text-green-600 dark:text-green-400" },
                        { label: "Leave", value: leave, color: "text-yellow-600 dark:text-yellow-400" },
                        { label: "Absent", value: absent, color: "text-red-600 dark:text-red-400" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl p-3 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
                            <p className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#666] mb-1">{label}</p>
                            <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-700/50 black:bg-[#141414] border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                                    {["Roll No", "Name", "Attendance"].map(h => (
                                        <th key={h} className={`px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444] whitespace-nowrap ${h === "Attendance" ? "text-center" : ""}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {studentsData.length > 0 ? studentsData.map((s, index) => (
                                    <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/30 black:hover:bg-[#141414] transition-colors">
                                        <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{s.collegeRollNo}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">{s.fullName}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => toggleAttendance(s.collegeRollNo)}
                                                className={`inline-flex items-center justify-center w-28 h-8 rounded-lg text-xs font-semibold transition-all ${s.attendance === "Present"
                                                    ? "bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-400/20 hover:bg-green-100 dark:hover:bg-green-400/20"
                                                    : s.attendance === "Absent"
                                                        ? "bg-red-50 dark:bg-red-400/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-400/20 hover:bg-red-100 dark:hover:bg-red-400/20"
                                                        : "bg-yellow-50 dark:bg-yellow-400/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-400/20 hover:bg-yellow-100 dark:hover:bg-yellow-400/20"
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${s.attendance === "Present" ? "bg-green-500"
                                                    : s.attendance === "Absent" ? "bg-red-500"
                                                        : "bg-yellow-500"
                                                    }`} />
                                                {s.attendance}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-10 text-gray-400 dark:text-zinc-600 black:text-[#333] text-sm">No records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={lectureAttendanceId === null ? handleSubmit : handleUpdate}
                        className="h-[42px] px-8 flex items-center gap-2 bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow transition-all duration-150"
                    >
                        {loading ? "Saving..." : "Submit Attendance"}
                    </button>
                </div>
            </div>

        </>
    )
}

export default AttendanceMark