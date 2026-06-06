import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { MdClass } from "react-icons/md";
import { useLocation } from "react-router-dom"
import AdminAttendance from "./AdminAttendance";


const Attendance = () => {
  const navigate = useNavigate()
  const [lectureList, setLectureList] = useState([])
  const route = useLocation()
  const isStudentRoute = route.pathname.split("/")[1] === "student"
  const isTeacherRoute = route.pathname.split("/")[1] === "teacher"
  const isAdminRoute = route.pathname.split("/")[1] === "admin"

  useEffect(() => {
    const fetchTeacherLectures = async () => {
      try {
        await axios.get('/api/v1/teachers/lecture').then((response) => {
          setLectureList(response?.data?.data?.lectures);
        }).catch((error) => {
          console.log(error?.response?.data?.message);
        })
      } catch (error) {
        console.log(error)
      }
    }
    if (isTeacherRoute) {
      fetchTeacherLectures()
    }
  }, [])

  return (
    <>
      {isTeacherRoute && <>
        <div className="w-full h-[3px] bg-[#ba7a4e]" />
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen">

          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
              <MdClass size={22} />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Conducted Classes</h1>
              <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
                View your assigned classes and manage their attendance.
              </p>
            </div>
          </div>

          {lectureList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lectureList.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="h-[3px] bg-[#ba7a4e]" />
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
                        <MdClass size={15} />
                      </span>
                      <h3 className="text-sm font-semibold text-[#ba7a4e] truncate">{item.degreeTitle}</h3>
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-2">
                    {[
                      { label: "Course Code", value: item.courseCode },
                      { label: "Section", value: item.section },
                      { label: "Semester", value: item.semester },
                      { label: "Shift", value: item.shift },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">{label}</span>
                        <span className="text-sm text-gray-700 dark:text-zinc-200 black:text-[#ccc] font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 pb-5 flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/teacher/attendance/submit?degree=${item.degreeTitle}&section=${item.section}&shift=${item.shift}&courseCode=${item.courseCode}&semester=${item.semester}`)}
                      className="w-full h-[38px] flex items-center justify-center bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-150"
                    >
                      Add Attendance
                    </button>
                    <button
                      onClick={() => navigate(`/teacher/attendance/edit?degree=${item.degreeTitle}&section=${item.section}&shift=${item.shift}&courseCode=${item.courseCode}&semester=${item.semester}`)}
                      className="w-full h-[38px] flex items-center justify-center bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 text-sm font-medium rounded-lg transition-all duration-150"
                    >
                      Edit Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
              <p className="text-center py-10 text-gray-400 dark:text-zinc-600 black:text-[#333] text-sm">No classes found</p>
            </div>
          )}
        </div>
      </>}
      {isAdminRoute && <AdminAttendance />}
    </>

  )
}

export default Attendance
