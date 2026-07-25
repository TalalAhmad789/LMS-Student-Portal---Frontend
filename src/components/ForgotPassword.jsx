import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import axios from 'axios'

const ForgotPassword = () => {

    const navigate = useNavigate()
    const route = useLocation()
    const isStudentPage = route.pathname.startsWith("/forgot-password")
    const isAdminPage = route.pathname.startsWith("/a-bh$d!f74d4")
    const isTeacherPage = route.pathname.startsWith("/t-fe7$nf!fd7")
    const { showSuccessToast, showErrorToast } = useToast()

    const [form, setForm] = useState({
        studentId: "",
        email: ""
    })

    const [teacherForm, setTeacherForm] = useState({
        teacherId: "",
        email: ""
    })

    const [adminForm, setAdminForm] = useState({
        email: ""
    })

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = () => {
        let newErrors = {}

        if (isStudentPage) {
            if (!form.studentId.trim()) {
                newErrors.studentId = "Student ID is required"
            }
            if (!form.email.trim()) {
                newErrors.email = "Email is required"
            }
        }

        if (isTeacherPage) {
            if (!teacherForm.teacherId.trim()) {
                newErrors.teacherId = "Teacher ID is required"
            }
            if (!teacherForm.email.trim()) {
                newErrors.email = "Email is required"
            }
        }

        if (isAdminPage) {
            if (!adminForm.email.trim()) {
                newErrors.email = "Email is required"
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (isStudentPage) {
            setForm({ ...form, [name]: value });
        }
        if (isTeacherPage) {
            setTeacherForm({ ...teacherForm, [name]: value });
        } if (isAdminPage) {
            setAdminForm({ ...adminForm, [name]: value });
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
        setLoading(true);
        await handleDelay(2);
        try {
            const response = await axios.post(`/api/v1/${isStudentPage ? "students" : isTeacherPage ? "teachers" : "admin"}/forgot-password`, isStudentPage ? form : isTeacherPage ? teacherForm : adminForm);
            if (response?.data?.success) {
                showSuccessToast(response.data.message);
                isStudentPage ? setForm({ studentId: "", email: "" }) : isTeacherPage ? setTeacherForm({ teacherId: "", email: "" }) : setAdminForm({ email: "" })
            }
        } catch (error) {
            showErrorToast(error?.response?.data?.message);
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-[url(/bg-back.jpg)] min-h-screen flex items-center justify-center py-10 px-4 overflow-hidden">
            <div className="relative z-10 w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 black:bg-[#0d0d0d]/95 border border-white/40 dark:border-zinc-700/60 black:border-[#1f1f1f] shadow-2xl rounded-3xl overflow-hidden">

                    <div className="h-[3px] bg-[#ba7a4e]" />

                    <div className="p-8">

                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center shadow-sm">
                                    <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">
                                Forgot Password
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888] mt-1.5 max-w-xs mx-auto">
                                Enter Your {isStudentPage ? "Student ID and registered email." : isTeacherPage ? "Teacher ID and registered email." : "registered email."}
                                We'll send you a reset link.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isAdminPage && <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">
                                    {isStudentPage ? "Student ID" : "Teacher ID"}
                                </label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name={`${isStudentPage ? "studentId" : "teacherId"}`}
                                    value={isStudentPage ? form.studentId : teacherForm.teacherId}
                                    placeholder={`${isStudentPage ? "Enter your Student ID" : "Enter your Teacher ID"}`}
                                    className="h-[42px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-800 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                                {errors.studentId && <p className="text-red-500 text-xs">{errors.studentId}</p>}
                                {errors.teacherId && <p className="text-red-500 text-xs">{errors.teacherId}</p>}
                            </div>}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">
                                    Email Address
                                </label>
                                <input
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    value={isStudentPage ? form.email : isTeacherPage ? teacherForm.email : adminForm.email}
                                    placeholder="Enter your registered email"
                                    className="h-[42px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-800 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full h-[42px] flex items-center justify-center bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-150 mt-2"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(`${isStudentPage ? "/login" : isTeacherPage ? "/t-fe7$nf!fd7/login" : "/a-bh$d!f74d4/login"}`)}
                                className="w-full h-[42px] flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-800 black:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-400 black:text-[#aaa] text-sm font-medium rounded-lg transition-all duration-150"
                            >
                                ← Back to Login
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword