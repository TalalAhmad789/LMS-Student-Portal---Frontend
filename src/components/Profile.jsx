import React, { useState, useEffect } from 'react'
import { useLocation, NavLink } from "react-router-dom";
import { useOutletContext } from 'react-router-dom';
import axios from 'axios'

function Profile() {

    const { studentInfo, teacherInfo } = useOutletContext();
    const route = useLocation();
    const [avatar, setAvatar] = useState(null);
    const [avatarImage, setAvatarImage] = useState();
    const [isImageUpdated, setIsImageUpdated] = useState(false);
    const [loading, setLoading] = useState(false);
    const isTeacherProfile = route.pathname === "/teacher/profile";
    const isStudentProfile = route.pathname === "/student/profile";
    const isAdminProfile = route.pathname === "/admin/profile";

    const fetchUserImage = async () => {
        await axios.get('/api/v1/students/me').then((response) => {
            setAvatarImage(response?.data?.data?.student?.profileImage);
        }).catch((error) => {
            console.log(error?.response?.data?.message);
        })
    }

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setAvatar(e.target.files[0])
        }
    }

    const handleAvatarSubmit = async (e) => {
        e.preventDefault();

        if (!avatar) {
            console.log("No file selected");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("avatar", avatar);
            formData.append("id", studentInfo._id);
            const response = await axios.post('/api/v1/students/change-profile-image', formData);
            console.log(response?.data?.data?.avatarUrl);
        } catch (error) {
            console.log(error?.response?.data?.message)
        } finally {
            setIsImageUpdated(!isImageUpdated);
            setAvatar(null);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserImage();
    }, [isImageUpdated])


    return (
        <>
            {isStudentProfile &&
                <div className="pb-24 p-6">
                    {/* Page Header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-800">🎓 Student Profile</h1>
                        <p className="text-sm text-gray-500">
                            View your academic and personal details below.
                        </p>
                    </div>

                    {/* Profile Overview */}
                    <div className="bg-white shadow-md rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                        {/* Profile Image */}
                        <div className="relative w-32 h-32">
                            <img
                                src={avatarImage === 'none' ? "/profile.jpg" : avatarImage}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full border-4 border-[#925fe2]"
                            />
                            {/* Hidden File Input */}
                            <input
                                name="avatar"
                                onChange={handleAvatarChange}
                                id="profileUpload"
                                type="file"
                                className="absolute inset-0 w-full h-full hidden cursor-pointer rounded-full z-10"
                            />
                            {/* Edit Button Overlay */}
                            <label
                                htmlFor="profileUpload"
                                className="absolute bottom-2 right-2 bg-[#925fe2] text-white px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-purple-700 transition z-20"
                            >
                                Edit
                            </label>
                        </div>

                        {/* Upload Button */}
                        <div className="flex flex-col gap-2">
                            {avatar && <>
                                <button
                                    onClick={handleAvatarSubmit}
                                    className="bg-[#925fe2] text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                >
                                    {loading ? "Uploading..." : "Upload"}
                                </button>
                            </>}
                        </div>



                        {/* Basic Info */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">{studentInfo?.fullName || "empty"}</h2>
                            <p className="text-gray-600 mt-1">
                                Degree: <span className="font-medium">{studentInfo?.degreeTitle || "empty"}</span>
                            </p>
                            <p className="text-gray-600">
                                Address: <span className="font-medium">{studentInfo?.address || "empty"}</span>
                            </p>
                        </div>
                    </div>

                    {/* Student Information Section */}
                    <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                            Student Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                            <p><span className="font-semibold">Student ID:</span> {studentInfo?.studentId || "empty"}</p>
                            <p><span className="font-semibold">Degree Title:</span> {studentInfo?.degreeTitle || "empty"}</p>
                            <p><span className="font-semibold">Registration No:</span> {studentInfo?.registrationNumber || "empty"}</p>
                            <p><span className="font-semibold">University Roll No:</span> {studentInfo?.universityRollNumber || "empty"}</p>
                            <p><span className="font-semibold">College Roll No:</span> {studentInfo?.collegeRollNo || "empty"}</p>
                            <p><span className="font-semibold">Shift:</span> {studentInfo?.shift || "empty"}</p>
                            <p><span className="font-semibold">Session:</span> {studentInfo?.session || "empty"}</p>
                            <p><span className="font-semibold">Status:</span> {studentInfo?.status || "empty"}</p>
                            <p><span className="font-semibold">STO Count:</span> {studentInfo?.stoCount || "empty"}</p>
                        </div>
                    </div>

                    {/* Personal Information Section */}
                    <div className="bg-white shadow-md rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                            <p><span className="font-semibold">Full Name:</span> {studentInfo?.fullName || "empty"}</p>
                            <p><span className="font-semibold">Background:</span> {studentInfo?.Background || "empty"}</p>
                            <p><span className="font-semibold">HSSC Degree:</span> {studentInfo?.hsscDegree || "empty"}</p>
                            <p><span className="font-semibold">HSSC Marks:</span> {studentInfo?.hsscMarks || "empty"}</p>
                            <p><span className="font-semibold">CNIC:</span> {studentInfo?.cnic || "empty"}</p>
                            <p><span className="font-semibold">Date of Birth:</span> {studentInfo?.dob || "empty"}</p>
                            <p><span className="font-semibold">Email:</span> {studentInfo?.email || "empty"}</p>
                            <p><span className="font-semibold">Phone:</span> {studentInfo?.phone || "empty"}</p>
                            <p><span className="font-semibold">Mobile:</span> {studentInfo?.mobile || "empty"}</p>
                        </div>
                    </div>
                </div>
            }
            {
                isTeacherProfile &&
                <div className="min-h-screen bg-gray-50 py-10">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-800">🎓 Teacher Profile</h1>
                        <p className="text-sm text-gray-500">
                            View your personal details below.
                        </p>
                    </div>

                    {/* About Section */}
                    <div className="bg-white shadow-xl rounded-2xl p-8 max-w-5xl mx-auto border border-gray-100 mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            📄 About Teacher
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
                            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="text-lg font-medium">
                                    {teacherInfo?.fullName || "empty"}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                <p className="text-sm text-gray-500">Specification</p>
                                <p className="text-lg font-medium">
                                    {teacherInfo?.specification || "empty"}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                <p className="text-sm text-gray-500">CNIC</p>
                                <p className="text-lg font-medium">
                                    {teacherInfo?.cnic || "empty"}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                <p className="text-sm text-gray-500">Teacher ID</p>
                                <p className="text-lg font-medium">
                                    {teacherInfo?.teacherId || "empty"}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-lg font-medium">
                                    {teacherInfo?.email || "empty"}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                <p className="text-sm text-gray-500">Status</p>
                                <span
                                    className={`px-3 py-1 text-sm font-semibold rounded-full ${teacherInfo?.status === "Active"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {teacherInfo?.status || "Active"}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            }
        </>
    )
}

export default Profile
