import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";


const Course = () => {

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

    const [errors, setErrors] = useState({})

    const validate = () => {
        let newErrors = {};

        if (!course.courseCode.trim()) {
            newErrors.courseCode = "Course Code is required";
        } else if (course.courseCode.length < 2) {
            newErrors.courseCode = "Minimum 2 characters required";
        } else if (course.courseCode.length > 50) {
            newErrors.courseCode = "Maximum 50 characters allowed";
        }

        if (!course.courseName.trim()) {
            newErrors.courseName = "Course Name is required";
        } else if (course.courseName.length < 2) {
            newErrors.courseName = "Minimum 2 characters required";
        } else if (course.courseName.length > 50) {
            newErrors.courseName = "Maximum 50 characters allowed";
        }

        if (!course.degreeTitle.trim()) {
            newErrors.degreeTitle = "Please select a program";
        }

        if (!course.semester.trim()) {
            newErrors.semester = "Please select a semester";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    const isDark = theme === "dark";

    const [course, setCourse] = useState({
        courseCode: "",
        courseName: "",
        degreeTitle: "",
        semester: ""
    });

    const [filters, setFilters] = useState({
        courseCode: "",
        courseName: ""
    });

    const [courseList, setCourseList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const coursePerPage = 10;

    const [filteredCourses, setFilteredCourses] = useState(courseList);

    const indexOfLastCourse = currentPage * coursePerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursePerPage;

    const totalPages = Math.ceil(filteredCourses.length / coursePerPage);

    const currentCourses = filteredCourses.slice(
        indexOfFirstCourse,
        indexOfLastCourse
    )

    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);

    const getCourse = async () => {
        setLoading3(true)
        try {
            const response = await axios.get("/api/v1/admin/courses", { withCredentials: true });
            if (response?.data?.success) {
                setCourseList(response?.data?.data?.courses)
            }
        } catch (error) {
            console.log(error?.response?.data?.message)
            setLoading3(false)
        } finally {
            setLoading3(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleDelay = (delay) =>
        new Promise((resolve) => setTimeout(resolve, delay * 1000));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setLoading(true);
            await handleDelay(3);

            const response = await axios.post(
                "/api/v1/admin/course/add",
                {
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    degreeTitle: course.degreeTitle,
                    semester: course.semester
                },
                { withCredentials: true }
            );
            if (response?.data?.success) {
                setCourse({
                    courseCode: "",
                    courseName: "",
                    degreeTitle: "",
                    semester: ""
                });
                getCourse();
                await Swal.fire({
                    title: response?.data?.message,
                    icon: "success",
                    draggable: true,
                    theme: isDark ? "dark" : "light"
                });
            }
        } catch (error) {
            Swal.fire({
                title: error?.response?.data?.message,
                icon: "error",
                draggable: true,
                theme: isDark ? "dark" : "light"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            theme: isDark ? "dark" : "light"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`/api/v1/admin/course/${id}`);
                    if (response?.data?.success) {
                        await handleDelay(2)
                        setCourseList(courseList.filter(item => item._id !== id));
                        await Swal.fire({
                            title: response?.data?.message,
                            icon: "success",
                            draggable: true,
                            theme: isDark ? "dark" : "light"
                        });
                    }
                } catch (error) {
                    await Swal.fire({
                        title: error?.response?.data?.message,
                        icon: "error",
                        draggable: true,
                        theme: isDark ? "dark" : "light"
                    });
                }
            }
        });
    };

    const handleFilter = async () => {

        setLoading2(true);
        await handleDelay(2);

        const result = courseList.filter((course) => {
            return (
                course.courseCode.toLowerCase().includes(filters.courseCode.toLowerCase()) &&
                course.courseName.toLowerCase().includes(filters.courseName.toLowerCase())
            );
        });

        setFilteredCourses(result);
        setCurrentPage(1);
        setLoading2(false);
    };

    const totalCourses = courseList.length;

    useEffect(() => {
        getCourse()
    }, [])

    useEffect(() => {
        setFilteredCourses(courseList)
    }, [courseList])


    return (
        <>
            <div className="w-full h-[3px] bg-[#ba7a4e]" />
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen">

                <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
                        <FaBookOpen size={22} />
                    </span>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Course Management</h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
                            Add, view, and manage all courses in the system.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                    <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl p-3 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
                        <p className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#666] mb-1">Total</p>
                        <p className="text-2xl font-bold text-[#ba7a4e]">{totalCourses}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-5">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                        <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e] text-lg font-bold leading-none">+</span>
                        <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">Add New Course</h2>
                    </div>
                    <div className="p-5">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="courseCode" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Course Code</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    id="courseCode"
                                    name="courseCode"
                                    value={course.courseCode}
                                    placeholder="Enter course code"
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                                {errors.courseCode && <p className="text-red-500 text-xs">{errors.courseCode}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="courseName" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Course Name</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    id="courseName"
                                    name="courseName"
                                    value={course.courseName}
                                    placeholder="Enter course name"
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                                {errors.courseName && <p className="text-red-500 text-xs">{errors.courseName}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="degreeTitle" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Degree Title</label>
                                <select
                                    onChange={handleChange}
                                    id="degreeTitle"
                                    name="degreeTitle"
                                    value={course.degreeTitle}
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                >
                                    <option value="">Select Program</option>
                                    <option>CS</option><option>IT</option><option>PHY</option>
                                    <option>CHEM</option><option>ISL</option><option>ENG</option>
                                </select>
                                {errors.degreeTitle && <p className="text-red-500 text-xs">{errors.degreeTitle}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="semester" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Semester</label>
                                <select
                                    onChange={handleChange}
                                    id="semester"
                                    name="semester"
                                    value={course.semester}
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                >
                                    <option value="">Select Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>{n}</option>)}
                                </select>
                                {errors.semester && <p className="text-red-500 text-xs">{errors.semester}</p>}
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                                <button
                                    type="submit"
                                    className="h-[40px] px-6 flex items-center gap-2 bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow transition-all duration-150"
                                >
                                    {loading ? "Adding..." : "Add Course"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm p-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={filters.courseCode}
                            onChange={(e) => setFilters({ ...filters, courseCode: e.target.value })}
                            placeholder="Course Code"
                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                        />
                        <input
                            type="text"
                            value={filters.courseName}
                            onChange={(e) => setFilters({ ...filters, courseName: e.target.value })}
                            placeholder="Course Name"
                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 h-[40px] bg-[#ba7a4e] hover:bg-[#a06840] text-white text-sm font-medium rounded-lg transition"
                            >
                                {loading2 ? "Filtering..." : "Apply"}
                            </button>
                            <button
                                onClick={() => { setFilters({ courseCode: "", courseName: "" }); setFilteredCourses(courseList); setCurrentPage(1); }}
                                className="flex-1 h-[40px] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] text-gray-700 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-200 dark:hover:bg-zinc-600 text-sm font-medium rounded-lg transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-700/50 black:bg-[#141414] border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                                    {["#", "Course Code", "Course Name", "Degree Title", "Semester", "Actions"].map(h => (
                                        <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading3 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-[#ba7a4e] text-sm">Loading...</td>
                                    </tr>
                                ) : filteredCourses.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-gray-400 dark:text-zinc-600 black:text-[#333] text-sm">No course records found</td>
                                    </tr>
                                ) : currentCourses.map((item, index) => (
                                    <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/30 black:hover:bg-[#141414] transition-colors">
                                        <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-600 black:text-[#444]">{indexOfFirstCourse + index + 1}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{item.courseCode}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white whitespace-nowrap">{item.courseName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.degreeTitle}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.semester}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <MdDelete size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-8 px-4 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            ← Prev
                        </button>
                        <span className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#666]">
                            Page <span className="font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">{currentPage}</span> of <span className="font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">{totalPages}</span>
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="h-8 px-4 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Course;
