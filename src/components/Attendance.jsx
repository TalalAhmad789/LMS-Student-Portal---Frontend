import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const Attendance = () => {
  const navigate = useNavigate()
  const [lectureList, setLectureList] = useState([])

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
    fetchTeacherLectures()
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 dark:bg-zinc-900 black:bg-black min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white mb-8 flex items-center gap-2">
        📚 Conducted Classes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lectureList.length > 0 ? lectureList.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl shadow-md p-6 border-t-4 border-[#ba7a4e] hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]"
          >
            <h3 className="text-lg font-semibold text-[#ba7a4e] mb-2">
              {item.degreeTitle}
            </h3>
            <ul className="text-gray-700 dark:text-zinc-300 black:text-[#aaa] space-y-1 text-sm mb-4">
              <li>
                <span className="font-medium text-gray-800 dark:text-zinc-200 black:text-[#ccc]">Class Section:</span>{" "}
                {item.section}
              </li>
              <li>
                <span className="font-medium text-gray-800 dark:text-zinc-200 black:text-[#ccc]">Course Code:</span>{" "}
                {item.courseCode}
              </li>
              <li>
                <span className="font-medium text-gray-800 dark:text-zinc-200 black:text-[#ccc]">Shift:</span> {item.shift}
              </li>
              <li>
                <span className="font-medium text-gray-800 dark:text-zinc-200 black:text-[#ccc]">Semester:</span> {item.semester}
              </li>
            </ul>
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate(`/teacher/attendance/submit?degree=${item.degreeTitle}&section=${item.section}&shift=${item.shift}&courseCode=${item.courseCode}&semester=${item.semester}`)
                }}
                className="w-full bg-[#ba7a4e] hover:bg-[#a06840] text-white py-2 rounded-lg shadow transition-all"
              >
                Add Attendance
              </button>
              <button
                onClick={() => {
                  navigate(`/teacher/attendance/edit?degree=${item.degreeTitle}&section=${item.section}&shift=${item.shift}&courseCode=${item.courseCode}&semester=${item.semester}`)
                }}
                className="w-full bg-[#eb435c] hover:bg-red-700 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 black:bg-red-500/10 black:hover:bg-red-500/20 black:text-red-400 text-white py-2 rounded-lg shadow transition-all"
              >
                Edit Attendance
              </button>
            </div>
          </div>
        )) : (
          <div className="font-semibold text-gray-500 dark:text-zinc-500 black:text-[#444]">No Class found</div>
        )}
      </div>
    </div>
  )
}

export default Attendance
