import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation, useNavigate, Link } from "react-router-dom";
import axios from 'axios'

function Dashboard() {
  const route = useLocation();
  const navigate = useNavigate()
  const isTeacherDash = route.pathname === '/teacher/dashboard'
  const isStudentDash = route.pathname === '/student/dashboard'
  const { teacherInfo, studentInfo } = useOutletContext();
  const [attendanceList, setAttendanceList] = useState([])
  const [overall, setOverall] = useState({
    classConducted: "",
    totalClassConducted: "",
    percentage: null
  })

  useEffect(() => {

    const fetchStudentAttendance = async () => {
      try {

        const response = await axios.post("/api/v1/students/attendance", { semester: studentInfo.semester, collegeRollNo: studentInfo.collegeRollNo, studentId: studentInfo.studentId, degreeTitle: studentInfo.degreeTitle }, { withCredentials: true });

        const attendance = response?.data?.data?.attendance;

        return attendance;

      } catch (error) {
        console.log(error?.response?.data?.data?.attendance);
      }

    }

    const fetchStudentCourses = async () => {

      try {
        const response = await axios.post('/api/v1/students/course', { semester: studentInfo?.semester, degreeTitle: studentInfo?.degreeTitle }, { withCredentials: true })
        return response?.data?.data?.courses.map((item, index) => {
          return { courseCode: item.courseCode, courseName: item.courseName };
        })


      } catch (error) {
        console.log(error?.response?.data?.message);
      }

    }

    const fetchResult = async () => {
      const courseArray = await fetchStudentCourses()
      const attendanceArray = await fetchStudentAttendance()

      const finalResult = courseArray.map((course, index) => {
        const filterAttendance = attendanceArray.filter(
          item => item.courseCode === course.courseCode
        );

        let presentCount = 0;
        let absentCount = 0;

        filterAttendance.map(item => {
          if (item.attendance === "Present") presentCount++;
          else if (item.attendance === "Absent") absentCount++;
        })

        const leaveCount = filterAttendance.length - (presentCount + absentCount);

        const totalCount = filterAttendance.length - leaveCount;

        const percentage = parseInt((presentCount / totalCount) * 100);

        return {
          courseName: course.courseName,
          courseCode: course.courseCode,
          percentage: isNaN(percentage) ? 0 : percentage,
          classConducted: `${presentCount}/${totalCount}`
        }

      })

      setAttendanceList(finalResult);

      const classConducted = finalResult.map((item) => {
        return parseInt(item.classConducted.split("/")[0])
      })

      const totalConducted = finalResult.map((item) => {
        return parseInt(item.classConducted.split("/")[1])
      })

      const classC = classConducted.reduce((a, b) => a + b, 0);
      const totalC = totalConducted.reduce((a, b) => a + b, 0);

      const totalPercentage = parseInt((classC / totalC) * 100);

      setOverall({
        classConducted: `${classC}/${totalC}`,
        totalClassConducted: `${totalC}`,
        percentage: isNaN(totalPercentage) ? 0 : totalPercentage
      })

    }

    if (isStudentDash) {
      fetchResult()
    }

  }, [])





  return (
    <>
      {route.pathname === "/teacher/dashboard" && (
        <div>Teacher Dashboard</div>
      )}

      {route.pathname === "/student/dashboard" && (
        <div className="min-h-screen bg-gray-100 pt-10 pb-24 px-5">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
          </div>

          {/* Top 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Profile */}
            <Link to={'/student/profile'} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-2">Profile</h2>
              <p className="text-gray-500 text-sm">View your personal details.</p>
            </Link>

            {/* Attendance */}
            <Link to={`/student/academics?semester=${studentInfo.semester}`} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-2">Attendance</h2>
              <p className="text-gray-500 text-sm">Check subject-wise attendance.</p>
            </Link>

            {/* Courses */}
            <Link to={'/student/security'} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-2">Security</h2>
              <p className="text-gray-500 text-sm">Change your password.</p>
            </Link>

          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

            {/* Attendance Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Attendance Overview
              </h2>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-gray-600">Overall Attendance</p>
                  <h3 className="text-4xl font-bold text-green-600">{overall.percentage}%</h3>
                </div>

                <div className="text-right">
                  <p className="text-gray-500 text-sm">Present: {overall.classConducted}</p>
                  <p className="text-gray-500 text-sm">Total: {overall.totalClassConducted}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>

              <div className="space-y-4">
                <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition font-medium">
                  <Link to={'/student/profile'}>
                    View Profile
                  </Link>
                </button>

                <button className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition font-medium">
                  Attendance Record
                </button>

                <button className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition font-medium">
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {route.pathname === "/admin/dashboard" && (
        <div className="text-center text-gray-700 p-10">
          Admin Dashboard Coming Soon...
        </div>
      )}
    </>
  );
}

export default Dashboard;
