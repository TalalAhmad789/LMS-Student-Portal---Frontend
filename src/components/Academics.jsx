import React, { useEffect, useState } from "react";
import { FaBook, FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import axios from "axios";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";

const Academics = () => {

  const { studentInfo } = useOutletContext()
  const [searchParams] = useSearchParams()
  const semester = parseInt(searchParams.get("semester")) || 1;
  const [attendance, setAttendance] = useState([])
  const [semesterList, setSemesterList] = useState([])

  useEffect(() => {
    if (!studentInfo?.semester) return;
    const generateSemesterSequence = (sem) => {
      return Array.from({ length: sem }, (_, i) => i + 1);
    };

    setSemesterList(generateSemesterSequence(studentInfo?.semester));
  }, [studentInfo]);

  useEffect(() => {

    const fetchAttendance = async () => {
      try {
        const response = await axios.post('/api/v1/students/attendance/calculate', {
          studentId: studentInfo.studentId,
          semester: semester,
          collegeRollNo: studentInfo?.collegeRollNo,
          degreeTitle: studentInfo?.degreeTitle
        }, {
          withCredentials: true
        })
        if (response?.data?.success) {
          setAttendance(response?.data?.data)
        }
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    }

    fetchAttendance()

  }, [semester, studentInfo])

  return (
    <div className="pt-8 px-8 pb-24 max-w-5xl mx-auto text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <FaBook className="text-yellow-500" />
          Academics
        </h1>
      </div>

      {/* Semester Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {semesterList.map((item, index) => {
          const isActive = parseInt(semester) == item

          return (
            <Link
              key={index}
              to={`/student/academics?semester=${item}`}
              className={`
          p-4 rounded-xl font-semibold shadow-md border text-center transition-all duration-300
          ${isActive
                  ? "bg-yellow-500 text-gray-900 border-yellow-600 scale-105 shadow-lg"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-yellow-400 hover:text-gray-900 hover:border-yellow-500 hover:scale-105"
                }
        `}
            >
              Semester {index + 1}
            </Link>
          );
        })}
      </div>


      {/* Subjects List */}
      <div className="grid sm:grid-cols-2 gap-5 ">
        {attendance?.courseAttendance?.map((item, index) => {
          return <div key={index}
            className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-lg transition relative"
          >
            {/* Attendance Percentage Circle */}
            <div className="absolute top-3 right-3 bg-yellow-200 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
              {item?.percentage}%
            </div>

            <h2 className="font-semibold text-[15px] ">{item?.courseName}</h2>
            <h2 className="text-[12px] font-semibold">({item?.courseCode})</h2>

            <div className="text-sm text-gray-600 mb-3">
              Attendance:{" "}
              <span className="font-semibold text-gray-800">
                {item?.classConducted}
              </span>
            </div>

            <button className="flex items-center gap-1 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition w-fit">
              <MdOutlineExplore />
              Explore
            </button>
          </div>
        })}
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-lg transition relative mt-5 w-full mx-auto ">
        {/* Overall Attendance Percentage Circle */}
        <div className="absolute top-3 right-3 bg-yellow-200 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
          {attendance?.overAllAttendance?.percentage}%
        </div>

        {/* Title */}
        <h2 className="font-semibold text-lg my-1">Overall Attendance</h2>

        {/* Attendance Numbers */}
        <div className="text-sm text-gray-600 mb-2">
          Classes Attended:{" "}
          <span className="font-semibold text-gray-800">{attendance?.overAllAttendance?.classConducted}</span>
        </div>
        <div className="text-sm text-gray-600">
          Total Classes:{" "}
          <span className="font-semibold text-gray-800">{attendance?.overAllAttendance?.totalClassConducted}</span>
        </div>

        {/* Optional Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: `${attendance?.overAllAttendance?.percentage}%` }}
          ></div>
        </div>
      </div>



    </div>
  );
};

export default Academics;
