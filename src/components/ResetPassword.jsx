import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useToast } from '../hooks/useToast'

const ResetPassword = () => {
    const { token } = useParams()
    const route = useLocation()
    const isStudentPage = route.pathname.startsWith("/reset-password")
    const isAdminPage = route.pathname.startsWith("/a-bh$d!f74d4")
    const isTeacherPage = route.pathname.startsWith("/t-fe7$nf!fd7")
    const navigate = useNavigate()
    const { showSuccessToast, showErrorToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        password: "",
        confirmPassword: ""
    })
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleDelay = (delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, delay * 1000);
        })
    }

    const validate = () => {
        let newErrors = {}

        if (!form?.password?.trim()) {
            newErrors.password = "New Password is required";
        }
        else if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }
        else if (!/[A-Z]/.test(form.password)) {
            newErrors.password = "Must contain at least 1 uppercase letter";
        }
        else if (!/[a-z]/.test(form.password)) {
            newErrors.password = "Must contain at least 1 lowercase letter";
        }
        else if (!/[0-9]/.test(form.password)) {
            newErrors.password = "Must contain at least 1 number";
        }
        else if (!/[@$!%*?&]/.test(form.password)) {
            newErrors.password = "Must contain at least 1 special character (@$!%*?&)";
        }

        if (!form?.confirmPassword?.trim()) {
            newErrors.confirmPassword = "Re-type password is required";
        }
        else if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await handleDelay(2);
        try {
            const response = await axios.post(`/api/v1/${isStudentPage ? "students" : isTeacherPage ? "teachers" : "admin"}/reset-password/${token}`, { password: form.password });
            if (response?.data?.success) {
                navigate(`${isStudentPage ? "/login" : isTeacherPage ? "/t-fe7$nf!fd7/login" : "/a-bh$d!f74d4/login"}`);
                showSuccessToast(response.data.message);
            }
        } catch (error) {
            showErrorToast(error.response.data.message);
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
                                Reset Password
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888] mt-1.5 max-w-xs mx-auto">
                                Enter your new password below. Make sure it's strong and memorable.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        className="h-[42px] w-full px-3 pr-16 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-800 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#ba7a4e] hover:text-[#a06840] transition"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter new password"
                                        className="h-[42px] w-full px-3 pr-16 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-800 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#ba7a4e] hover:text-[#a06840] transition"
                                    >
                                        {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full h-[42px] flex items-center justify-center bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-150 mt-2"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
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
        </div >
    )
}

export default ResetPassword