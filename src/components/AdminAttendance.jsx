// ── Imports ──────────────────────────────────────────────
import { useState, useEffect } from "react";
import { MdBarChart, MdGroup, MdPerson, MdWarning, MdFilterList } from "react-icons/md";
import axios from "axios";
import Swal from 'sweetalert2'

// ── AttendanceBadge helper component ─────────────────────
const AttendanceBadge = ({ pct }) => {
    const color =
        pct >= 75 ? { bar: "bg-green-500", text: "text-green-600 dark:text-green-400", track: "bg-green-100 dark:bg-green-400/10" }
            : pct >= 50 ? { bar: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400", track: "bg-yellow-100 dark:bg-yellow-400/10" }
                : { bar: "bg-red-500", text: "text-red-500 dark:text-red-400", track: "bg-red-100 dark:bg-red-400/10" };
    return (
        <div className="flex items-center gap-2 min-w-[100px]">
            <div className={`flex-1 h-1.5 rounded-full ${color.track}`}>
                <div className={`h-1.5 rounded-full ${color.bar}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-xs font-semibold ${color.text} min-w-[32px] text-right`}>{pct}%</span>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────
const AdminAttendance = () => {

    const getTheme = () => {
        if (document.documentElement.classList.contains("dark")) return "dark";
        return "light";
    };

    const [theme, setTheme] = useState(getTheme);

    const isDark = theme === "dark";

    const [activeTab, setActiveTab] = useState("class");
    const handleDelay = (delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, delay * 1000);
        })
    }

    // ── By Class state ──
    const [classForm, setClassForm] = useState({ degreeTitle: "", semester: "", section: "", shift: "" });
    const [classData, setClassData] = useState([]);
    const [loadingClass, setLoadingClass] = useState(false);

    // ── By Student state ──
    const [studentForm, setStudentForm] = useState({ studentId: "", collegeRollNo: "", degreeTitle: "", semester: "" });
    const [studentData, setStudentData] = useState([]);
    const [loadingStudent, setLoadingStudent] = useState(false);

    // ── At Risk state ──
    const [riskForm, setRiskForm] = useState({ degreeTitle: "", semester: "", section: "", shift: "" });
    const [riskData, setRiskData] = useState([]);
    const [loadingRisk, setLoadingRisk] = useState(false);

    // ── Stat card values (compute from data or fetch separately) ──
    const totalStudents = studentData.length;
    const avgAttendance = studentData.length
        ? Math.round(studentData.reduce((sum, s) => sum + s.percentage, 0) / studentData.length)
        : 0;
    const atRiskCount = studentData.filter(s => s.percentage < 50).length;
    const classesTracked = classData.length;

    const handleClassAttendance = async (e) => {
        e.preventDefault();
        setLoadingClass(true);
        await handleDelay(3);
        try {
            const response = await axios.post('/api/v1/admin/attendance-by-class', classForm);

            if (response?.data?.success) {
                setClassData(response.data.data.attendance);
                setClassForm({ degreeTitle: "", semester: "", section: "", shift: "" })
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
            setLoadingClass(false)
        } finally {
            setLoadingClass(false)
        }
    };

    const handleStudentAttendance = async (e) => {
        e.preventDefault();
        setLoadingStudent(true);
        await handleDelay(3);

        try {
            const response = await axios.post("/api/v1/admin/attendance-by-student", studentForm);

            if (response?.data?.success) {
                setStudentData(response.data.data.attendance);
                setStudentForm({ studentId: "", collegeRollNo: "", degreeTitle: "", semester: "" });
                await Swal.fire({
                    title: response.data.message,
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
            setLoadingStudent(false)
        } finally {
            setLoadingStudent(false)
        }
    }

    const handleRiskAttendance = async (e) => {
        e.preventDefault();
        setLoadingRisk(true);
        await handleDelay(3);

        try {
            const response = await axios.post("/api/v1/admin/attendance-by-so-student", riskForm);

            if (response?.data?.success) {
                setRiskData(response.data.data.attendance);
                console.log(response.data.data.attendance)
                setRiskForm({ degreeTitle: "", semester: "", section: "", shift: "" });
                await Swal.fire({
                    title: response.data.message,
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
            setLoadingRisk(false)
        } finally {
            setLoadingRisk(false)
        }
    }

    return (
        <>
            <div className="w-full h-[3px] bg-[#ba7a4e]" />
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen">

                <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
                        <MdBarChart size={22} />
                    </span>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Attendance Management</h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
                            Calculate and monitor student attendance across classes.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total Students", value: totalStudents, color: "text-[#ba7a4e]" },
                        { label: "Avg Attendance", value: `${avgAttendance}%`, color: "text-green-600 dark:text-green-400" },
                        { label: "At Risk (below 50%)", value: atRiskCount, color: "text-red-500 dark:text-red-400" },
                        { label: "Classes Tracked", value: classesTracked, color: "text-gray-800 dark:text-zinc-100" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl p-3 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
                            <p className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#666] mb-1">{label}</p>
                            <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {[
                        { key: "class", label: "By Class", icon: <MdGroup size={15} /> },
                        { key: "student", label: "By Student", icon: <MdPerson size={15} /> },
                        { key: "risk", label: "At Risk (below 50%)", icon: <MdWarning size={15} /> },
                    ].map(({ key, label, icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`h-[36px] px-4 flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-all duration-150 ${activeTab === key
                                ? "bg-[#ba7a4e] text-white border-[#ba7a4e]"
                                : "bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 black:border-[#2a2a2a] hover:border-[#ba7a4e] hover:text-[#ba7a4e]"
                                }`}
                        >
                            {icon} {label}
                        </button>
                    ))}
                </div>

                {activeTab === "class" && (
                    <>
                        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-4">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                                <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e]"><MdFilterList size={15} /></span>
                                <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">Filter by Class</h2>
                            </div>

                            <form onSubmit={handleClassAttendance} className="p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Degree</label>
                                        <select value={classForm.degreeTitle} onChange={(e) => setClassForm({ ...classForm, degreeTitle: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Program</option>
                                            <option>CS</option><option>IT</option><option>PHY</option><option>CHEM</option><option>ISL</option><option>ENG</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Semester</label>
                                        <select value={classForm.semester} onChange={(e) => setClassForm({ ...classForm, semester: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Semester</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>{n}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Section</label>
                                        <select value={classForm.section} onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Section</option>
                                            <option>G1</option><option>G2</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Shift</label>
                                        <select value={classForm.shift} onChange={(e) => setClassForm({ ...classForm, shift: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Shift</option>
                                            <option>Morning</option><option>Evening</option>
                                        </select>
                                    </div>
                                    <div className="col-span-full flex justify-end mt-2">
                                        <button
                                            type="submit"
                                            className="h-[40px] px-6 bg-[#ba7a4e] hover:bg-[#a06840] text-white text-sm font-medium rounded-lg transition"
                                        >
                                            {loadingClass ? "Loading..." : "Submit"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-zinc-700/50 black:bg-[#141414] border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                                            {["#", "College RN", "Ovr Attendance"].map(h => (
                                                <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classData.length === 0 ? (
                                            <tr><td colSpan="8" className="text-center py-10 text-gray-400 dark:text-zinc-600 text-sm">No records found</td></tr>
                                        ) : classData.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                                                <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-600">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{item.collegeRollNo}</td>
                                                <td className="px-4 py-3"><AttendanceBadge pct={item.overallPercentage} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "student" && (
                    <>
                        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-4">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                                <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e]"><MdFilterList size={15} /></span>
                                <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">Search Student</h2>
                            </div>
                            <form onSubmit={handleStudentAttendance} className="p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Student ID</label>
                                        <input type="text" value={studentForm.studentId} onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                                            placeholder="Enter student ID"
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">College RN</label>
                                        <input type="text" value={studentForm.collegeRollNo} onChange={(e) => setStudentForm({ ...studentForm, collegeRollNo: e.target.value })}
                                            placeholder="Enter college RN"
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Degree</label>
                                        <select value={studentForm.degreeTitle} onChange={(e) => setStudentForm({ ...studentForm, degreeTitle: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Program</option>
                                            <option>CS</option><option>IT</option><option>PHY</option><option>CHEM</option><option>ISL</option><option>ENG</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Semester</label>
                                        <select value={studentForm.semester} onChange={(e) => setStudentForm({ ...studentForm, semester: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Semester</option>
                                            <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option>
                                        </select>
                                    </div>
                                    <div className="col-span-full flex justify-end mt-2">
                                        <button
                                            type="submit"
                                            className="h-[40px] px-6 bg-[#ba7a4e] hover:bg-[#a06840] text-white text-sm font-medium rounded-lg transition"
                                        >
                                            {loadingStudent ? "Loading..." : "Submit"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-zinc-700/50 border-b border-gray-100 dark:border-zinc-700">
                                            {["#", "Student ID", "CollegeRN", "Full Name", "Degree", "Semester", "Total", "Attended", "Ovr Attendance"].map(h => (
                                                <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentData.length === 0 ? (
                                            <tr><td colSpan="9" className="text-center py-10 text-gray-400 dark:text-zinc-600 text-sm">No records found</td></tr>
                                        ) : studentData.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                                                <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-600">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{item.studentId}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 whitespace-nowrap">{item.collegeRollNo}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 whitespace-nowrap">{item.fullName}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.degreeTitle}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.semester}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.totalClassCount}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.totalPresentCount}</td>
                                                <td className="px-4 py-3"><AttendanceBadge pct={item.overallPercentage} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "risk" && (
                    <>
                        <div className="flex items-center gap-2.5 px-4 py-3 mb-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg">
                            <MdWarning size={16} className="text-red-500 dark:text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">Students listed below have attendance below 50% and are at risk of being short of attendance.</p>
                        </div>

                        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-4">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                                <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e]"><MdFilterList size={15} /></span>
                                <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">Filter At-Risk Students</h2>
                            </div>
                            <form onSubmit={handleRiskAttendance} className="p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Degree</label>
                                        <select value={riskForm.degreeTitle} onChange={(e) => setRiskForm({ ...riskForm, degreeTitle: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Program</option>
                                            <option>CS</option><option>IT</option><option>PHY</option><option>CHEM</option><option>ISL</option><option>ENG</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Semester</label>
                                        <select value={riskForm.semester} onChange={(e) => setRiskForm({ ...riskForm, semester: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Semester</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>{n}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Section</label>
                                        <select value={riskForm.section} onChange={(e) => setRiskForm({ ...riskForm, section: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Section</option>
                                            <option>G1</option><option>G2</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Shift</label>
                                        <select value={riskForm.shift} onChange={(e) => setRiskForm({ ...riskForm, shift: e.target.value })}
                                            className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                                            <option value="">Select Shift</option>
                                            <option>Morning</option><option>Evening</option>
                                        </select>
                                    </div>
                                    <div className="col-span-full flex justify-end mt-2">
                                        <button
                                            type="submit"
                                            className="h-[40px] px-6 bg-[#ba7a4e] hover:bg-[#a06840] text-white text-sm font-medium rounded-lg transition"
                                        >
                                            {loadingRisk ? "Loading..." : "Submit"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-zinc-700/50 border-b border-gray-100 dark:border-zinc-700">
                                            {["#", "CollegeRN", "Full Name", "Total", "Attended", "OVR Attendance", "Status"].map(h => (
                                                <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riskData.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-10 text-gray-400 dark:text-zinc-600 text-sm">No at-risk students found</td></tr>
                                        ) : riskData.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                                                <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-600">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{item.collegeRollNo}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 whitespace-nowrap">{item.fullName}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.totalClassCount}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{item.totalPresentCount}</td>
                                                <td className="px-4 py-3"><AttendanceBadge pct={item.overallPercentage} /></td>
                                                <td className="px-4 py-3">
                                                    {item.overallPercentage < 35 ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-50 dark:bg-red-400/10 text-red-600 dark:text-red-400">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Critical
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-yellow-50 dark:bg-yellow-400/10 text-yellow-700 dark:text-yellow-400">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Warning
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </>
    );
};

export default AdminAttendance;