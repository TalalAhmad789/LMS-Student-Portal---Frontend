import React, { useState, useEffect } from "react";
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaEye, FaChalkboardTeacher } from "react-icons/fa";
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
            < div className={`fixed inset-0 ${menu ? "flex" : "hidden"} justify-center items-center bg-black/50 backdrop-blur-sm z-50 px-4`
            }>
                <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] w-full md:w-[70vw] lg:w-[55vw] max-h-[90vh] flex flex-col rounded-2xl shadow-2xl relative border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] overflow-hidden">

                    <div className="h-[3px] bg-[#ba7a4e] flex-shrink-0" />

                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e]">
                                <FaChalkboardTeacher size={16} />
                            </span>
                            <h2 className="text-base font-medium text-gray-800 dark:text-zinc-100 black:text-white">
                                Edit Teacher Record
                            </h2>
                        </div>
                        <button
                            onClick={() => setMenu(!menu)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-zinc-500 black:text-[#666] hover:text-red-500 dark:hover:text-red-400 black:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 px-6 py-5">
                        <form onSubmit={handleTeacherUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Teacher ID</span>
                                <input
                                    type="text"
                                    disabled
                                    placeholder={`${teacherDetails.teacherId}`}
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-700 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700/30 black:bg-[#141414] text-gray-400 dark:text-zinc-600 black:text-[#444] cursor-not-allowed"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Full Name</span>
                                <input
                                    type="text"
                                    onChange={handleTeacherFormChange}
                                    name="fullName"
                                    value={teacherDetails.fullName}
                                    placeholder="Full Name"
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Specification</span>
                                <select onChange={handleChange} id="specification" name="specification" value={teacherDetails.specification}
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                    <option value="">Select Specification</option>
                                    <option>CS</option><option>IT</option><option>PHY</option><option>CHEM</option><option>ISL</option><option>ENG</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Status</span>
                                <select
                                    onChange={handleTeacherFormChange}
                                    name="status"
                                    value={teacherDetails.status}
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                >
                                    <option>Status</option>
                                    <option>Active</option>
                                    <option>Disabled</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">CNIC Number</span>
                                <input
                                    onChange={handleTeacherFormChange}
                                    type="text"
                                    name="cnic"
                                    value={teacherDetails.cnic}
                                    placeholder="CNIC Number"
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Email</span>
                                <input
                                    onChange={handleTeacherFormChange}
                                    type="email"
                                    name="email"
                                    value={teacherDetails.email}
                                    placeholder="Email"
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                            </div>

                            <button
                                type="submit"
                                className="col-span-1 sm:col-span-2 h-[42px] flex items-center justify-center gap-2 bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow transition-all duration-150 mt-2"
                            >
                                {loading1 ? "Saving..." : "Update Teacher"}
                            </button>
                        </form>
                    </div>
                </div>
            </div >

            < div className="w-full h-[3px] bg-[#ba7a4e]" />
            < div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen" >

                < div className="flex items-center gap-3 mb-6" >
                    <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
                        <FaChalkboardTeacher size={20} />
                    </span>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Teacher Management</h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
                            Add, view, and manage all registered teachers in the system.
                        </p>
                    </div>
                </div >

                < div className="grid grid-cols-2 gap-3 mb-6" >
                    {
                        [
                            { label: "Total Teachers", value: totalTeachers, color: "text-[#ba7a4e]" },
                            { label: "Active Teachers", value: activeTeachers, color: "text-green-600 dark:text-green-400 black:text-green-500" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl p-3 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
                                <p className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#666] mb-1">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                            </div>
                        ))
                    }
                </div >

                < div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-5" >
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                        <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e] text-lg font-bold leading-none">+</span>
                        <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">Add New Teacher</h2>
                    </div>
                    <div className="p-5">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="fullName" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Full Name</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={teacherform.fullName}
                                    placeholder="Enter full name"
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="specification" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Specification</label>
                                <select onChange={handleChange} id="specification" name="specification" value={teacherform.specification}
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                    <option value="">Select Specification</option>
                                    <option>CS</option><option>IT</option><option>PHY</option><option>CHEM</option><option>ISL</option><option>ENG</option>
                                </select>
                                {errors.specification && <p className="text-red-500 text-xs">{errors.specification}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Email</label>
                                <input
                                    onChange={handleChange}
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={teacherform.email}
                                    placeholder="Enter email"
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="cnic" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">CNIC Number</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    id="cnic"
                                    name="cnic"
                                    value={teacherform.cnic}
                                    placeholder="XXXXX-XXXXXXX-X"
                                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                                {errors.cnic && <p className="text-red-500 text-xs">{errors.cnic}</p>}
                            </div>

                            <div className="sm:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    className="h-[40px] px-6 flex items-center gap-2 bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow transition-all duration-150"
                                >
                                    {loading ? "Adding..." : "Add Teacher"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >

                < div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm p-4 mb-4" >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={filters.teacherId}
                            onChange={(e) => setFilters({ ...filters, teacherId: e.target.value })}
                            placeholder="Teacher ID"
                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                        />
                        <input
                            type="text"
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            placeholder="Name"
                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 h-[40px] bg-[#ba7a4e] hover:bg-[#a06840] text-white text-sm font-medium rounded-lg transition"
                            >
                                {loading2 ? "Filtering..." : "Apply"}
                            </button>
                            <button
                                onClick={() => { setFilters({ teacherId: "", name: "" }); setFilteredTeachers(teacherList); setCurrentPage(1); }}
                                className="flex-1 h-[40px] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] text-gray-700 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-200 dark:hover:bg-zinc-600 text-sm font-medium rounded-lg transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div >

                < div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden" >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-700/50 black:bg-[#141414] border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                                    {["#", "Name", "Teacher ID", "Specification", "Status", "Actions"].map(h => (
                                        <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading3 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-[#ba7a4e] text-sm">Loading...</td>
                                    </tr>
                                ) : filteredTeachers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-gray-400 dark:text-zinc-600 black:text-[#333] text-sm">No teacher records found</td>
                                    </tr>
                                ) : currectTeachers.map((item, index) => (
                                    <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/30 black:hover:bg-[#141414] transition-colors">
                                        <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-600 black:text-[#444]">{indexOfFirstTeacher + index + 1}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white whitespace-nowrap">{item.fullName}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{item.teacherId}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.specification}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${item.status === "Active"
                                                ? "bg-green-50 dark:bg-green-400/10 black:bg-green-500/10 text-green-700 dark:text-green-400 black:text-green-500"
                                                : "bg-red-50 dark:bg-red-400/10 black:bg-red-500/10 text-red-600 dark:text-red-400 black:text-red-500"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => { handleFetchTeacherRecord(item._id); setMenu(!menu); }}
                                                    className="w-8 h-8 flex items-center justify-center bg-[#ba7a4e] hover:bg-[#a06840] text-white rounded-lg shadow-sm transition"
                                                    title="View / Edit"
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleResetPassword(item._id)}
                                                    className="w-8 h-8 flex items-center justify-center bg-[#ba7a4e]/10 hover:bg-[#ba7a4e]/20 text-[#ba7a4e] border border-[#ba7a4e]/20 rounded-lg transition"
                                                    title="Reset Password"
                                                >
                                                    <MdLockReset size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-500/10 black:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 black:hover:bg-red-500/20 text-red-500 dark:text-red-400 black:text-red-500 border border-red-100 dark:border-red-500/20 black:border-red-500/20 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <MdDelete size={16} />
                                                </button>
                                            </div>
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
                </div >
            </div >
        </>
    );
};

export default Teacher;

