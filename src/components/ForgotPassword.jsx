import React from 'react'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {

    const navigate = useNavigate()

    return (
        <div className="bg-[url(/bg-back.jpg)] min-h-screen flex items-center justify-center py-10 px-4 overflow-hidden">
            <div className="relative z-10 w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 black:bg-[#0d0d0d]/95 border border-white/40 dark:border-zinc-700/60 black:border-[#1f1f1f] shadow-2xl rounded-3xl overflow-hidden">

                    {/* Top accent bar */}
                    <div className="h-[3px] bg-[#ba7a4e]" />

                    <div className="p-8">

                        {/* Logo + Title */}
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
                                Enter your Student ID and registered email. We'll send you a reset link.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-4">

                            {/* Student ID */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">
                                    Student ID
                                </label>
                                <input
                                    type="text"
                                    name="studentId"
                                    placeholder="Enter your Student ID"
                                    className="h-[42px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-800 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your registered email"
                                    className="h-[42px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-800 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full h-[42px] flex items-center justify-center bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-150 mt-2"
                            >
                                Send Reset Link
                            </button>

                            {/* Back to Login */}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
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