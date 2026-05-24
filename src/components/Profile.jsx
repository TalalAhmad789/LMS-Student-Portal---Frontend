import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { useOutletContext } from 'react-router-dom';
import axios from 'axios'
import { FiEdit3 } from "react-icons/fi";
import {
    HiOutlineAcademicCap,
    HiOutlineUser,
    HiOutlineIdentification,
    HiOutlineMapPin,
    HiOutlineBriefcase,
} from "react-icons/hi2";
import { GiGraduateCap } from "react-icons/gi";
import { IoMdMail } from "react-icons/io";

function Profile() {
    const { studentInfo, teacherInfo, adminInfo } = useOutletContext();

    const route = useLocation();
    const [avatarImage, setAvatarImage] = useState();
    const [loading, setLoading] = useState(false);
    const isTeacherProfile = route.pathname === "/teacher/profile";
    const isStudentProfile = route.pathname === "/student/profile";
    const isAdminProfile = route.pathname === "/admin/profile";
    const [errors, setErrors] = useState({});

    const fetchUserImage = async () => {
        const endpoint = isTeacherProfile
            ? "/api/v1/teachers/me"
            : isAdminProfile ? "/api/v1/admin/me" : "/api/v1/students/me";

        try {
            const response = await axios.get(endpoint);
            if (response?.data?.success) {
                const img = isTeacherProfile
                    ? response?.data?.data?.teacher?.profileImage
                    : isAdminProfile ? response?.data?.data?.admin?.profileImage
                        : response?.data?.data?.student?.profileImage;
                setAvatarImage(img);
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
        }

    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        const newErrors = {};

        if (!file) return;

        if (file.size > 2097152) {
            newErrors.sizeError = "File size exceeds the maximum limit of 2MB.";
            setErrors(newErrors);
            return;
        }

        const validExt = [".jpeg", ".jpg", ".png", ".webp"];
        const hasValidExt = validExt.some(ext => file.name.toLowerCase().endsWith(ext));
        if (!hasValidExt) {
            newErrors.typeError = "Invalid file type. Please upload a JPG, JPEG, PNG, or WEBP image.";
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setAvatarImage(URL.createObjectURL(file));
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("avatar", file);

            if (isStudentProfile) {
                formData.append("id", studentInfo._id);
                const response = await axios.post("/api/v1/students/change-profile-image", formData);
                setAvatarImage(response?.data?.data?.avatarUrl);
            }
            if (isTeacherProfile) {
                formData.append("id", teacherInfo._id);
                const response = await axios.post("/api/v1/teachers/change-profile-image", formData);
                setAvatarImage(response?.data?.data?.avatarUrl);
            }
            if (isAdminProfile) {
                formData.append("id", adminInfo._id);
                const response = await axios.post("/api/v1/admin/change-profile-image", formData);
                setAvatarImage(response?.data?.data?.avatarUrl);
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserImage();
    }, []);

    const Field = ({ label, value, accent }) => (
        <div className="flex flex-col gap-0.5">
            <span className="text-[11px] uppercase tracking-widest font-medium text-gray-400 dark:text-zinc-500 black:text-[#444]">
                {label}
            </span>
            <span className={`text-sm break-words ${accent
                ? "text-[#ba7a4e] font-semibold"
                : value
                    ? "text-gray-800 dark:text-zinc-100 black:text-white"
                    : "text-gray-400 dark:text-zinc-600 black:text-[#333] italic"
                }`}>
                {value || "—"}
            </span>
        </div>
    );

    const SectionCard = ({ icon: Icon, title, children }) => (
        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
                    <Icon size={15} />
                </span>
                <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">
                    {title}
                </h2>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5">
                {children}
            </div>
        </div>
    );

    return (
        <>
            {isStudentProfile && (
                <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a]">

                    <div className="relative bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ba7a4e]" />

                        <div className="px-4 sm:px-6 pt-7 pb-5">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                    <div className="relative group">
                                        <label htmlFor="avatar" className="cursor-pointer block">
                                            <img
                                                src={avatarImage || "/profile.jpg"}
                                                alt="profile"
                                                className="w-24 h-24 rounded-full object-cover border-[3px] border-white dark:border-zinc-700 black:border-[#1f1f1f] shadow-lg transition duration-300 group-hover:brightness-75"
                                            />
                                        </label>
                                        {
                                            !loading && (
                                                <label htmlFor="avatar">
                                                    <div className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-[#ba7a4e] rounded-full flex items-center justify-center text-white shadow-md border-2 border-white dark:border-zinc-800 black:border-[#0d0d0d] cursor-pointer hover:bg-[#a06840] transition">
                                                        <FiEdit3 size={13} />
                                                    </div>
                                                </label>
                                            )
                                        }

                                        {loading && (
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-medium backdrop-blur-sm">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mb-1" />
                                                Uploading
                                            </div>
                                        )}
                                        <input type="file" id="avatar" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    </div>

                                    {(errors.sizeError || errors.typeError) && (
                                        <p className="text-[11px] text-red-500 dark:text-red-400 text-center max-w-[130px] leading-tight">
                                            {errors.sizeError || errors.typeError}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1 text-center sm:text-left w-full">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-[#ba7a4e] bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 rounded-full px-3 py-1 mb-3">
                                        <HiOutlineAcademicCap size={13} />
                                        Student Profile
                                    </span>

                                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white leading-tight">
                                        {studentInfo?.fullName || "Student Name"}
                                    </h1>

                                    <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888] mt-1">
                                        {"BS"+studentInfo?.degreeTitle || "—"}
                                        {studentInfo?.shift && <> &nbsp;·&nbsp; {studentInfo.shift} Shift</>}
                                    </p>

                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                        {studentInfo?.studentId && (
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 black:text-[#666]">
                                                <HiOutlineIdentification size={14} />
                                                {studentInfo.studentId}
                                            </span>
                                        )}
                                        {studentInfo?.degreeTitle && (
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 black:text-[#666]">
                                                <GiGraduateCap size={14} />
                                                {studentInfo.degreeTitle}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 flex justify-center sm:justify-start">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 ${studentInfo?.status === "Active"
                                            ? "bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400 black:text-green-400"
                                            : "bg-red-50 dark:bg-red-400/10 text-red-600 dark:text-red-400 black:text-red-400"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${studentInfo?.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                                            {studentInfo?.status || "Active"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 flex flex-col gap-4">
                        <SectionCard icon={HiOutlineAcademicCap} title="Student Information">
                            <Field label="Student ID" value={studentInfo?.studentId} accent />
                            <Field label="Degree Title" value={studentInfo?.degreeTitle} />
                            <Field label="Registration No" value={studentInfo?.registrationNumber} />
                            <Field label="University Roll No" value={studentInfo?.universityRollNumber} />
                            <Field label="College Roll No" value={studentInfo?.collegeRollNo} />
                            <Field label="Shift" value={studentInfo?.shift} />
                            <Field label="Session" value={studentInfo?.session} />
                            <Field label="Status" value={studentInfo?.status} />
                            <Field label="STO Count" value={studentInfo?.stoCount} />
                        </SectionCard>

                        <SectionCard icon={HiOutlineUser} title="Personal Information">
                            <Field label="Full Name" value={studentInfo?.fullName} />
                            <Field label="Background" value={studentInfo?.Background} />
                            <Field label="HSSC Degree" value={studentInfo?.hsscDegree} />
                            <Field label="HSSC Marks" value={studentInfo?.hsscMarks} />
                            <Field label="CNIC" value={studentInfo?.cnic} />
                            <Field label="Date of Birth" value={studentInfo?.dob} />
                            <Field label="Email" value={studentInfo?.email} />
                            <Field label="Phone" value={studentInfo?.phone} />
                            <Field label="Mobile" value={studentInfo?.mobile} />
                        </SectionCard>
                    </div>
                </div>
            )}

            {isTeacherProfile && (
                <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a]">

                    <div className="relative bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ba7a4e]" />

                        <div className="px-4 sm:px-6 pt-7 pb-5">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                    <div className="relative group">
                                        <label htmlFor="teacherAvatar" className="cursor-pointer block">
                                            <img
                                                src={avatarImage || "/profile.jpg"}
                                                alt="profile"
                                                className="w-24 h-24 rounded-full object-cover border-[3px] border-white dark:border-zinc-700 black:border-[#1f1f1f] shadow-lg transition duration-300 group-hover:brightness-75"
                                            />
                                        </label>
                                        {!loading && (
                                            <label htmlFor="teacherAvatar">
                                                <div className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-[#ba7a4e] rounded-full flex items-center justify-center text-white shadow-md border-2 border-white dark:border-zinc-800 black:border-[#0d0d0d] cursor-pointer hover:bg-[#a06840] transition">
                                                    <FiEdit3 size={13} />
                                                </div>
                                            </label>
                                        )}
                                        {loading && (
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-medium backdrop-blur-sm">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mb-1" />
                                                Uploading
                                            </div>
                                        )}
                                        <input type="file" id="teacherAvatar" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    </div>

                                    {(errors.sizeError || errors.typeError) && (
                                        <p className="text-[11px] text-red-500 dark:text-red-400 text-center max-w-[130px] leading-tight">
                                            {errors.sizeError || errors.typeError}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1 text-center sm:text-left w-full">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-[#ba7a4e] bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 rounded-full px-3 py-1 mb-3">
                                        <HiOutlineBriefcase size={13} />
                                        Teacher Profile
                                    </span>

                                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white leading-tight">
                                        {teacherInfo?.fullName || "Teacher Name"}
                                    </h1>

                                    <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888] mt-1">
                                        {"Department "+teacherInfo?.specification || "—"}
                                    </p>

                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                        {teacherInfo?.teacherId && (
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 black:text-[#666]">
                                                <HiOutlineIdentification size={14} />
                                                {teacherInfo.teacherId}
                                            </span>
                                        )}
                                        {teacherInfo?.email && (
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 black:text-[#666]">
                                                <IoMdMail size={14} />
                                                {teacherInfo.email}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 flex justify-center sm:justify-start">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 ${teacherInfo?.status === "Active"
                                            ? "bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400 black:text-green-400"
                                            : "bg-red-50 dark:bg-red-400/10 text-red-600 dark:text-red-400 black:text-red-400"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${teacherInfo?.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                                            {teacherInfo?.status || "Active"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <SectionCard icon={HiOutlineUser} title="About Teacher">
                            <Field label="Full Name" value={teacherInfo?.fullName} />
                            <Field label="Teacher ID" value={teacherInfo?.teacherId} accent />
                            <Field label="Specification" value={teacherInfo?.specification} />
                            <Field label="CNIC" value={teacherInfo?.cnic} />
                            <Field label="Email" value={teacherInfo?.email} />
                            <Field label="Status" value={teacherInfo?.status} />
                        </SectionCard>
                    </div>
                </div>
            )}
            {isAdminProfile && (
                <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a]">

                    <div className="relative bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ba7a4e]" />

                        <div className="px-4 sm:px-6 pt-7 pb-5">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                    <div className="relative group">
                                        <label htmlFor="adminAvatar" className="cursor-pointer block">
                                            <img
                                                src={avatarImage || "/profile.jpg"}
                                                alt="profile"
                                                className="w-24 h-24 rounded-full object-cover border-[3px] border-white dark:border-zinc-700 black:border-[#1f1f1f] shadow-lg transition duration-300 group-hover:brightness-75"
                                            />
                                        </label>
                                        {!loading && (
                                            <label htmlFor="adminAvatar">
                                                <div className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-[#ba7a4e] rounded-full flex items-center justify-center text-white shadow-md border-2 border-white dark:border-zinc-800 black:border-[#0d0d0d] cursor-pointer hover:bg-[#a06840] transition">
                                                    <FiEdit3 size={13} />
                                                </div>
                                            </label>
                                        )}
                                        {loading && (
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-medium backdrop-blur-sm">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mb-1" />
                                                Uploading
                                            </div>
                                        )}
                                        <input type="file" id="adminAvatar" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    </div>

                                    {(errors.sizeError || errors.typeError) && (
                                        <p className="text-[11px] text-red-500 dark:text-red-400 text-center max-w-[130px] leading-tight">
                                            {errors.sizeError || errors.typeError}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1 text-center sm:text-left w-full">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-[#ba7a4e] bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 rounded-full px-3 py-1 mb-3">
                                        <HiOutlineBriefcase size={13} />
                                        {adminInfo.isSuperAdmin ? "Super Admin Profile" : "Admin Profile"}
                                    </span>

                                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white leading-tight">
                                        {adminInfo?.fullName || "Teacher Name"}
                                    </h1>

                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                        {adminInfo?.email && (
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 black:text-[#666]">
                                                <IoMdMail size={14} />
                                                {adminInfo.email}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 flex justify-center sm:justify-start">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 ${adminInfo?.status === "Active"
                                            ? "bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400 black:text-green-400"
                                            : "bg-red-50 dark:bg-red-400/10 text-red-600 dark:text-red-400 black:text-red-400"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${adminInfo?.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                                            {adminInfo?.status || "Active"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <SectionCard icon={HiOutlineUser} title="About Admin">
                            <Field label="Full Name" value={adminInfo?.fullName} />
                            <Field label="CNIC" value={adminInfo?.cnic} />
                            <Field label="Email" value={adminInfo?.email} />
                            <Field label="Status" value={adminInfo?.status} />
                        </SectionCard>
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;