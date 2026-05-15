import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";


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
            <div className="p-6 bg-gray-50 dark:bg-zinc-900 black:bg-black min-h-screen">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 black:text-white">🎓 Course Management</h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">
                        Add, view, and manage all course in the system.
                    </p>
                </div>

                {/* Stat Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                        <h3 className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">Total Courses</h3>
                        <p className="text-2xl font-bold text-[#ba7a4e]">{totalCourses}</p>
                    </div>
                </div>

                {/* Add Course Form */}
                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-xl rounded-2xl p-8 mb-10 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white mb-6 flex items-center gap-2">
                        <span className="text-[#ba7a4e] text-3xl">+</span> Add New Course
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Course Code */}
                        <div className="flex flex-col">
                            <label htmlFor="courseCode" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                                Course Code
                            </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="courseCode"
                                name="courseCode"
                                value={course.courseCode}
                                placeholder="Enter Course Code"
                                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
                            />
                            {errors.courseCode && <p className="text-red-500 text-sm">{errors.courseCode}</p>}
                        </div>

                        {/* Course Name */}
                        <div className="flex flex-col">
                            <label htmlFor="courseName" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                                Course Name
                            </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="courseName"
                                name="courseName"
                                value={course.courseName}
                                placeholder="Enter Course Name"
                                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
                            />
                            {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName}</p>}
                        </div>

                        {/* Degree Title */}
                        <div className="flex flex-col">
                            <label htmlFor="degreeTitle" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                                Degree Title
                            </label>
                            <select
                                onChange={handleChange}
                                id="degreeTitle"
                                name="degreeTitle"
                                value={course.degreeTitle}
                                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
                            >
                                <option value="">Select Program</option>
                                <option>BSCS</option>
                                <option>BSIT</option>
                                <option>BSPHY</option>
                                <option>BSCHEM</option>
                                <option>BSISL</option>
                                <option>BSENG</option>
                            </select>
                            {errors.degreeTitle && <p className="text-red-500 text-sm">{errors.degreeTitle}</p>}
                        </div>

                        {/* Semester */}
                        <div className="flex flex-col">
                            <label htmlFor="semester" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                                Semester
                            </label>
                            <select
                                onChange={handleChange}
                                id="semester"
                                name="semester"
                                value={course.semester}
                                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
                            >
                                <option value="">Select Semester</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                            </select>
                            {errors.semester && <p className="text-red-500 text-sm">{errors.semester}</p>}
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-[#ba7a4e] hover:bg-[#a06840] text-white font-medium px-6 py-2.5 rounded-lg shadow transition duration-200"
                            >
                                {loading ? "Loading..." : "Add Course"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-4 mb-6 border border-gray-100 dark:border-zinc-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                        <input
                            type="text"
                            value={filters.courseCode}
                            onChange={(e) =>
                                setFilters({ ...filters, courseCode: e.target.value })
                            }
                            placeholder="Course Code"
                            className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
                        />

                        <input
                            type="text"
                            value={filters.courseName}
                            onChange={(e) =>
                                setFilters({ ...filters, courseName: e.target.value })
                            }
                            placeholder="Course Name"
                            className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
                        />

                        <div className="flex gap-2">

                            <button
                                onClick={handleFilter}
                                className="flex-1 bg-[#ba7a4e] hover:bg-[#a86a3f] text-white font-medium rounded-lg px-4 py-3 transition"
                            >
                                {loading2 ? "Filtering..." : "Apply"}
                            </button>

                            <button
                                onClick={() => {
                                    setFilters({ courseCode: "", courseName: "" });
                                    setFilteredCourses(courseList);
                                    setCurrentPage(1);
                                }}
                                className="flex-1 bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-500 font-medium rounded-lg px-4 py-3 transition"
                            >
                                Reset
                            </button>

                        </div>

                    </div>

                </div>

                {/* Course Table */}
                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-md rounded-xl overflow-x-auto border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-zinc-700/60 black:bg-[#141414] text-gray-700 dark:text-zinc-300 black:text-[#555] text-sm uppercase tracking-wide">
                                <th className="p-3">#</th>
                                <th className="p-3">Course Code</th>
                                <th className="p-3">Course Name</th>
                                <th className="p-3">Degree Title</th>
                                <th className="p-3">Semester</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading3 ? <tr>
                                <td colSpan="6" className="text-center p-6 text-[#ba7a4e]">Loading...</td>
                            </tr> : filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-6 text-gray-400 dark:text-zinc-500 black:text-[#333]">
                                        No Course Record
                                    </td>
                                </tr>
                            ) : (
                                currentCourses.map((item, index) => (
                                    <tr key={index} className="border-t border-gray-100 dark:border-zinc-700 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/40 black:hover:bg-[#141414] text-gray-800 dark:text-zinc-200 black:text-[#ccc] transition-colors">
                                        <td className="p-3 text-gray-400 dark:text-zinc-500 black:text-[#3a3a3a]">{indexOfFirstCourse + index + 1}</td>
                                        <td className="p-3 font-semibold text-[#ba7a4e]">{item.courseCode}</td>
                                        <td className="p-3 font-medium">{item.courseName}</td>
                                        <td className="p-3">{item.degreeTitle}</td>
                                        <td className="p-3">{item.semester}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 black:bg-red-500/10 black:hover:bg-red-500/20 black:text-red-500 text-white rounded-lg transition"
                                            >
                                                <MdDelete size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">

                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-gray-700 dark:text-zinc-300">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Course;
