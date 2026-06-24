import React, { useState, useEffect } from 'react'
import { PiStudentFill } from "react-icons/pi";
import { GrAnnounce } from "react-icons/gr";
import { FaArrowTrendUp } from "react-icons/fa6";
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import { useTheme } from '../contexts/ThemeContext';

const StudentPromotion = () => {

    const { theme } = useTheme()
    const isDark = theme === "dark";

    const [classForm, setClassForm] = useState({ degreeTitle: "", semester: "" })
    const [studentsData, setStudentsData] = useState([])
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = () => {
        let newErrors = {}

        if (!classForm.degreeTitle) {
            newErrors.degreeTitle = "Please select a program"
        }

        if (!classForm.semester) {
            newErrors.semester = "Please select a semester"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0;
    }

    const handleDelay = (delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, delay * 1000);
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClassForm({ ...classForm, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;
        setLoading1(true)
        await handleDelay(2)
        try {
            const response = await axios.post('/api/v1/admin/get-student-for-promotion', classForm);
            if (response?.data?.success) {
                setStudentsData(response.data.data.students)
                setClassForm({ degreeTitle: "", semester: "" })
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: isDark ? "dark" : "light",
                    transition: Bounce
                });
            }
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: isDark ? "dark" : "light",
                transition: Bounce
            });
            setLoading1(false)
        } finally {
            setLoading1(false)
        }
    }

    const handlePromotion = async (e) => {
        e.preventDefault()
        setLoading2(true)
        await handleDelay(2)

        try {
            const response = await axios.post('/api/v1/admin/student-promotion', studentsData);
            if (response?.data?.success) {
                setStudentsData([])
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: isDark ? "dark" : "light",
                    transition: Bounce
                });
            }
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: isDark ? "dark" : "light",
                transition: Bounce
            });
            setLoading2(false)
        } finally {
            setLoading2(false)
        }
    }

    return (
        <>
            <div className="w-full h-[3px] bg-[#ba7a4e]" />
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen">

                <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
                        <GrAnnounce size={22} />
                    </span>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Academic Promotion</h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
                            Promote all registered students in the system.
                        </p>
                    </div>
                </div>

                {studentsData.length === 0 && <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-5">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                        <span className="w-7 h-7 text-sm rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e] font-bold leading-none"><FaArrowTrendUp /></span>
                        <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">Promote Class</h2>
                    </div>
                    <div className="p-5">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="degreeTitle" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Degree Program</label>
                                <select onChange={handleChange} id="degreeTitle" name="degreeTitle" value={classForm.degreeTitle}
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                    <option value="">Select Program</option>
                                    <option>CS</option><option>IT</option><option>PHY</option><option>CHEM</option><option>ISL</option><option>ENG</option>
                                </select>
                                {errors.degreeTitle && <p className="text-red-500 text-xs">{errors.degreeTitle}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="semester" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Semester</label>
                                <select onChange={handleChange} id="semester" name="semester" value={classForm.semester}
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                    <option value="">Select Semester</option>
                                    <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option>
                                </select>
                                {errors.semester && <p className="text-red-500 text-xs">{errors.semester}</p>}
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                                <button type="submit"
                                    className="h-[40px] px-6 flex items-center gap-2 bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow transition-all duration-150">
                                    {loading1 ? "Loading..." : "Filter Class"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>}

                {studentsData.length > 0 && (
                    <div className="mb-5 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-sm">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 black:text-white">
                                    Promotion Review
                                </h2>

                                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                                    Verify the student list before permanently promoting the class.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#ba7a4e]/10 text-[#ba7a4e] border border-[#ba7a4e]/20">
                                    {studentsData.length} Students Found
                                </span>
                            </div>
                        </div>

                        <div className="p-5">

                            <div className="rounded-xl border border-[#ba7a4e]/20 bg-[#ba7a4e]/5 p-4 mb-5">
                                <h4 className="font-medium text-[#ba7a4e] mb-2">
                                    Important Information
                                </h4>

                                <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                                    <li>• Students will be promoted to the next semester.</li>
                                    <li>• Semester results will be saved in student records.</li>
                                    <li>• Attendance history will be archived.</li>
                                    <li>• Promotion date and academic history will be maintained.</li>
                                    <li>• Verify the student list before proceeding.</li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setStudentsData([])}
                                    className="px-6 py-2 text-sm rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                                >
                                    Reset Selection
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePromotion}
                                    className="px-8 py-2 text-sm rounded-lg bg-[#ba7a4e] hover:bg-[#a06840] text-white font-medium shadow-sm transition-all"
                                >
                                    {loading2 ? "Promoting..." : "Promote & Save Attendance"}
                                </button>

                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-700/50 border-b border-gray-100 dark:border-zinc-700">
                                    {["#", "CollegeRN", "StudentId", "Full Name", "Degree", "Semester", "Shift", "Section"].map(h => (
                                        <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {studentsData.length === 0 ? (
                                    <tr><td colSpan="8" className="text-center py-10 text-gray-400 dark:text-zinc-600 text-sm">No student found</td></tr>
                                ) : studentsData.map((item, index) => (
                                    <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                                        <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-600">{index + 1}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{item.collegeRollNo}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{item.studentId}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 whitespace-nowrap">{item.fullName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.degreeTitle}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.semester}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.shift}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.section}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    )
}

export default StudentPromotion