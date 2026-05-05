import React, { useState, useEffect } from "react";
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaEye } from "react-icons/fa";
import { MdDelete, MdLockReset } from "react-icons/md";

const Teacher = () => {

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

    const [errors, setErrors] = useState({})

    const validate = () => {
        const newErrors = {}

        if (!teacherform.fullName.trim()) {
            newErrors.fullName = "Full name is required"
        } else if (teacherform.fullName.length < 2) {
            newErrors.fullName = "Minimum 2 characters required";
        } else if (teacherform.fullName.length > 50) {
            newErrors.fullName = "Maximum 50 characters allowed";
        }

        if (!teacherform.specification.trim()) {
            newErrors.specification = "Specification is required"
        }

        if (!teacherform.email.trim()) {
            newErrors.email = "Email is required"
        }

        if (!teacherform.cnic.trim()) {
            newErrors.cnic = "CNIC is required";
        } else if (teacherform.cnic.length < 15) {
            newErrors.cnic = "Please enter a valid cnic"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0;
    }

    const [teacherform, setTeacherform] = useState({
        fullName: "",
        specification: "",
        email: "",
        cnic: ""
    })

    const [filters, setFilters] = useState({
        teacherId: "",
        name: ""
    })

    const [teacherDetails, setTeacherDetails] = useState({
        fullName: "",
        specification: "",
        cnic: "",
        status: "",
        teacherId: "",
        email: "",
    })

    const [teacherList, setTeacherList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const teacherPerPage = 10

    const [filteredTeachers, setFilteredTeachers] = useState(teacherList);

    const indexOfLastTeacher = currentPage * teacherPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - teacherPerPage;
    const totalPages = Math.ceil(filteredTeachers.length / teacherPerPage);

    const currectTeachers = filteredTeachers.slice(
        indexOfFirstTeacher,
        indexOfLastTeacher
    )

    const [menu, setMenu] = useState(false)
    const [loading3, setLoading3] = useState(false)

    const getTeacherList = async () => {
        setLoading3(true)
        try {
            const response = await axios.get('/api/v1/admin/teachers');
            if (response?.data?.success) {
                setTeacherList(response?.data?.data?.teachers)
            }
        } catch (error) {
            console.log(error?.response?.data?.message)
            setLoading3(false)
        } finally {
            setLoading3(false)
        }
    }

    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "cnic") {

            let digits = value.replace(/\D/g, "");

            if (digits.length > 5 && digits.length <= 12) {
                digits = digits.slice(0, 5) + "-" + digits.slice(5);
            } else if (digits.length > 12) {
                digits =
                    digits.slice(0, 5) +
                    "-" +
                    digits.slice(5, 12) +
                    "-" +
                    digits.slice(12, 13);
            }

            setTeacherform({ ...teacherform, cnic: digits });
        } else {
            setTeacherform({ ...teacherform, [name]: value });
        }
    }

    const handleTeacherFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "cnic") {

            let digits = value.replace(/\D/g, "");

            if (digits.length > 5 && digits.length <= 12) {
                digits = digits.slice(0, 5) + "-" + digits.slice(5);
            } else if (digits.length > 12) {
                digits =
                    digits.slice(0, 5) +
                    "-" +
                    digits.slice(5, 12) +
                    "-" +
                    digits.slice(12, 13);
            }

            setTeacherDetails({ ...teacherDetails, cnic: digits });
        } else {
            setTeacherDetails({ ...teacherDetails, [name]: value });
        }
    }

    const handleDelay = (delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, delay * 1000);
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true)
            await handleDelay(4)

            const response = await axios.post('/api/v1/admin/teacher/register', teacherform);
            if (response?.data?.success) {
                await Swal.fire({
                    title: response?.data?.message,
                    icon: "success",
                    draggable: true,
                    theme: isDark ? "dark" : "light"
                });
                setTeacherform({
                    fullName: "",
                    specification: "",
                    email: "",
                    cnic: ""
                })
                getTeacherList()
            }
        } catch (error) {
            await Swal.fire({
                title: error?.response?.data?.message,
                icon: "error",
                draggable: true,
                theme: isDark ? "dark" : "light"
            });
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Remove it!",
                theme: isDark ? "dark" : "light"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await axios.delete(`/api/v1/admin/teacher/${id}`);
                    if (response?.data?.success) {
                        await handleDelay(2)
                        setTeacherList(teacherList.filter(item => item._id !== id));
                        await Swal.fire({
                            title: response?.data?.message,
                            icon: "success",
                            draggable: true,
                            theme: isDark ? "dark" : "light"
                        });
                    }
                }
            });
        } catch (error) {
            await handleDelay(2)
            await Swal.fire({
                title: error?.response?.data?.message,
                icon: "error",
                draggable: true,
                theme: isDark ? "dark" : "light"
            });
        }
    }

    const handleFetchTeacherRecord = (id) => {
        const teacher = teacherList.find(item => item._id === id);
        if (teacher) {
            setTeacherDetails({
                _id: "",
                fullName: "",
                specification: "",
                cnic: "",
                status: "",
                teacherId: "",
                email: "",
                ...teacher
            })
        }
    }

    const handleTeacherUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading1(true)
            const id = teacherDetails?._id;
            const response = await axios.put(`/api/v1/admin/teacher/${id}`, teacherDetails);
            if (response?.data?.success) {
                await handleDelay(4)
                await Swal.fire({
                    title: response?.data?.message,
                    icon: "success",
                    draggable: true,
                    theme: isDark ? "dark" : "light"
                });
                setMenu(!menu)
                getTeacherList()
            }
        } catch (error) {
            setLoading1(false)
            await Swal.fire({
                title: error?.response?.data?.message,
                icon: "error",
                draggable: true,
                theme: isDark ? "dark" : "light"
            });
            setMenu(!menu)
        } finally {
            setLoading1(false)
        }
    }

    const handleFilter = async () => {
        setLoading2(true)
        await handleDelay(2)
        const result = teacherList.filter((teacher) => {
            return (
                teacher.teacherId.toLowerCase().includes(filters.teacherId.toLowerCase()) &&
                teacher.fullName.toLowerCase().includes(filters.name.toLowerCase())
            )
        })

        setFilteredTeachers(result);
        setCurrentPage(1);
        setLoading2(false);
    }

    const handleResetPassword = async (id) => {
        try {
            Swal.fire({
                title: "Do you want to reset the password?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Reset",
                denyButtonText: `Don't reset`,
                theme: isDark ? "dark" : "light"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await axios.post("/api/v1/admin/teacher/reset-password", { id: id }, { withCredentials: true });
                    if (response?.data?.success) {
                        await Swal.fire({
                            title: "Reset!",
                            icon: "success",
                            theme: isDark ? "dark" : "light"
                        });
                    }
                }
                else if (result.isDenied) {
                    await Swal.fire({
                        title: "Password are not reset!",
                        icon: "info",
                        theme: isDark ? "dark" : "light"
                    });
                }
            });
        } catch (error) {
            await Swal.fire({
                title: error.response.data.message,
                icon: "error",
                draggable: true,
                theme: isDark ? "dark" : "light"
            });
        }
    }

    const totalTeachers = teacherList.length;

    const activeTeachers = teacherList.filter(
        (teacher) => teacher.status === "Active"
    ).length;

    useEffect(() => {
        getTeacherList()
    }, [])

    useEffect(() => {
        setFilteredTeachers(teacherList)
    }, [teacherList])

    return (
        <>
            <div className={`fixed inset-0 ${menu ? "flex" : "hidden"} justify-center items-center bg-black/60 z-50`}>
                <div className="bg-white dark:bg-zinc-800 w-[90vw] md:w-[70vw] lg:w-[60vw] max-h-[90vh] flex flex-col rounded-xl shadow-2xl relative p-6 border dark:border-zinc-700">

                    <button onClick={() => { setMenu(!menu); }} className="absolute top-3 right-3 text-gray-500 dark:text-zinc-400 black:text-[#666] hover:text-red-500 dark:hover:text-red-400 black:hover:text-red-500 text-xl font-bold">
                        ✕
                    </button>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white mb-6">📝 Teacher Record</h2>
                    <div className="overflow-y-auto pr-2 flex-1">
                        <form onSubmit={handleTeacherUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <label className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-400 black:text-[#555]">Teacher ID</span>
                                <input
                                    type="text"
                                    disabled
                                    placeholder={`${teacherDetails.teacherId}`}
                                    className="px-4 py-2 border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-100 dark:bg-zinc-700/50 black:bg-[#111] text-gray-400 dark:text-zinc-500 black:text-[#444] cursor-not-allowed"
                                />
                            </label>

                            <label className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">Full Name</span>
                                <input
                                    type="text"
                                    onChange={handleTeacherFormChange}
                                    name="fullName"
                                    value={teacherDetails.fullName}
                                    placeholder="Full Name"
                                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] transition"
                                />
                            </label>

                            <label className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">Specification</span>
                                <input
                                    type="text"
                                    onChange={handleTeacherFormChange}
                                    name="specification"
                                    value={teacherDetails.specification}
                                    placeholder="Specification"
                                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] transition"
                                />
                            </label>

                            <label className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">Status</span>
                                <select
                                    onChange={handleTeacherFormChange}
                                    name="status"
                                    value={teacherDetails.status}
                                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] transition"
                                >
                                    <option>Status</option>
                                    <option>Active</option>
                                    <option>Disabled</option>
                                </select>
                            </label>

                            <label className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">CNIC Number</span>
                                <input
                                    onChange={handleTeacherFormChange}
                                    type="text"
                                    name="cnic"
                                    value={teacherDetails.cnic}
                                    placeholder="CNIC Number"
                                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] transition"
                                />
                            </label>

                            <label className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">Email</span>
                                <input
                                    onChange={handleTeacherFormChange}
                                    type="email"
                                    name="email"
                                    value={teacherDetails.email}
                                    placeholder="Email"
                                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] transition"
                                />
                            </label>

                            <button
                                type="submit"
                                className="col-span-1 md:col-span-2 bg-[#ba7a4e] hover:bg-[#a06840] text-white py-2 rounded-lg shadow transition"
                            >
                                {loading1 ? "Loading..." : "Update Teacher"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-zinc-900 black:bg-black min-h-screen">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 black:text-white">Teacher Management</h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">
                        Add, view, and manage all registered teachers in the system.
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                        <h3 className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">Total Teachers</h3>
                        <p className="text-2xl font-bold text-[#ba7a4e]">{totalTeachers}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                        <h3 className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">Active Teachers</h3>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 black:text-green-500">{activeTeachers}</p>
                    </div>
                </div>

                {/* Add Teacher Form */}
                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-xl rounded-2xl p-8 mb-10 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white mb-6 flex items-center gap-2">
                        <span className="text-[#ba7a4e] text-3xl">+</span> Add New Teacher
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="fullName" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                                Full Name
                            </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={teacherform.fullName}
                                placeholder="Enter full name"
                                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
                            />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="specification" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                                Specification
                            </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="specification"
                                name="specification"
                                value={teacherform.specification}
                                placeholder="Enter specification"
                                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
                            />
                            {errors.specification && <p className="text-red-500 text-sm">{errors.specification}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                                Email
                            </label>
                            <input
                                onChange={handleChange}
                                type="email"
                                id="email"
                                name="email"
                                value={teacherform.email}
                                placeholder="Enter email"
                                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="cnic" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                                CNIC Number
                            </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="cnic"
                                name="cnic"
                                value={teacherform.cnic}
                                placeholder="XXXXX-XXXXXXX-X"
                                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
                            />
                            {errors.cnic && <p className="text-red-500 text-sm">{errors.cnic}</p>}
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-[#ba7a4e] hover:bg-[#a06840] text-white font-medium px-6 py-2.5 rounded-lg shadow transition duration-200"
                            >
                                {loading ? "Loading..." : "Add Teacher"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-4 mb-6 border border-gray-100 dark:border-zinc-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <input
                            type="text"
                            value={filters.teacherId}
                            onChange={(e) =>
                                setFilters({ ...filters, teacherId: e.target.value })
                            }
                            placeholder="Teacher ID"
                            className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
                        />

                        <input
                            type="text"
                            value={filters.name}
                            onChange={(e) =>
                                setFilters({ ...filters, name: e.target.value })
                            }
                            placeholder="Name"
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
                                    setFilters({ teacherId: "", name: "" });
                                    setFilteredTeachers(teacherList);
                                    setCurrentPage(1)
                                }}
                                className="flex-1 bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-500 font-medium rounded-lg px-4 py-3 transition"
                            >
                                Reset
                            </button>
                        </div>

                    </div>

                </div>

                {/* Teacher Table */}
                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-md rounded-xl overflow-x-auto border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-zinc-700/60 black:bg-[#141414] text-gray-700 dark:text-zinc-300 black:text-[#555] text-sm uppercase tracking-wide">
                                <th className="p-3">#</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Teacher-Id</th>
                                <th className="p-3">Specification</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading3 ? <tr>
                                <td colSpan="6" className="text-center p-6 text-[#ba7a4e]">Loading...</td>
                            </tr> : filteredTeachers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-6 text-gray-400 dark:text-zinc-500 black:text-[#333]">No Teacher Record</td>
                                </tr>
                            ) : currectTeachers.map((item, index) => (
                                <tr key={index} className="border-t border-gray-100 dark:border-zinc-700 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/40 black:hover:bg-[#141414] text-gray-800 dark:text-zinc-200 black:text-[#ccc] transition-colors">
                                    <td className="p-3 text-gray-400 dark:text-zinc-500 black:text-[#3a3a3a]">{indexOfFirstTeacher + index + 1}</td>
                                    <td className="p-3 font-medium">{item.fullName}</td>
                                    <td className="p-3 font-semibold text-[#ba7a4e]">{item.teacherId}</td>
                                    <td className="p-3">{item.specification}</td>
                                    <td className="p-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${item.status === "Active"
                                            ? "bg-green-100 dark:bg-green-400/10 black:bg-green-500/10 text-green-700 dark:text-green-400 black:text-green-500"
                                            : "bg-red-100 dark:bg-red-400/10 black:bg-red-500/10 text-red-600 dark:text-red-400 black:text-red-500"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3 flex md:flex-row flex-col md:gap-x-2 gap-y-2">
                                        <button
                                            onClick={() => { handleFetchTeacherRecord(item._id); setMenu(!menu); }}
                                            className="px-3 py-1 text-sm bg-[#ba7a4e] hover:bg-[#a06840] text-white rounded-lg shadow transition"
                                        >
                                            <FaEye size={18} />
                                        </button>
                                        <button
                                            onClick={() => { handleResetPassword(item._id); }}
                                            className="px-3 py-1 text-sm bg-[#ba7a4e] hover:bg-[#a06840] text-white rounded-lg shadow transition"
                                        >
                                            <MdLockReset size={18} />
                                        </button>
                                        <button
                                            onClick={() => { handleDelete(item._id) }}
                                            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 black:bg-red-500/10 black:hover:bg-red-500/20 black:text-red-500 text-white rounded-lg transition"
                                        >
                                            <MdDelete size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
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

export default Teacher;

