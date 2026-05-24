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
  const [semesterList, setSemesterList] = useState([]);
  const current_date = Date.now();
  const timeStamps = new Date(current_date);
  const year = timeStamps.getFullYear();
  const month = String(timeStamps.getMonth() + 1).padStart(2, "0");
  const datee = String(timeStamps.getDate()).padStart(2, "0");
  const [date, setDate] = useState(`${year}-${month}-${datee}`);
  const [specificAttendance, setSpecificAttendance] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChangeDate = async (e) => {

    const selectedDate = e.target.value;

    setDate(selectedDate);
    setLoading(true)
    try {
      const response = await axios.post('/api/v1/students/specific-attendance', {
        date: selectedDate,
        degreeTitle: studentInfo.degreeTitle,
        semester: studentInfo.semester,
        studentId: studentInfo.studentId,
        collegeRollNo: studentInfo.collegeRollNo
      });

      if (response?.data?.success) {
        setSpecificAttendance(response.data.data.attendance);
      }
    } catch (error) {
      console.log(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

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
          degreeTitle: studentInfo?.degreeTitle,
          section: studentInfo?.section,
          shift: studentInfo?.shift
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

  useEffect(() => {

    const fetchSpecificAttendance = async () => {
      setLoading(true)
      try {

        const response = await axios.post(
          '/api/v1/students/specific-attendance',
          {
            date,
            degreeTitle: studentInfo.degreeTitle,
            semester: studentInfo.semester,
            studentId: studentInfo.studentId,
            collegeRollNo: studentInfo.collegeRollNo
          }
        );

        if (response?.data?.success) {
          setSpecificAttendance(response.data.data.attendance);
        }

      } catch (error) {
        console.log(error?.response?.data?.message);
      } finally {
        setLoading(false)
      }
    };

    fetchSpecificAttendance();

  }, []);


  return (
    <>
      <div className="w-full h-[3px] bg-[#ba7a4e]" />
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen">

        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
            <FaBook size={18} />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Academics</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
              View your semester-wise courses and attendance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mb-6">
          {semesterList.map((item, index) => {
            const isActive = parseInt(semester) == item;
            return (
              <Link
                key={index}
                to={`/student/academics?semester=${item}`}
                className={`h-[38px] flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-150 border ${isActive
                  ? "bg-[#ba7a4e] text-white border-[#ba7a4e] shadow-sm"
                  : "bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] text-gray-600 dark:text-zinc-400 black:text-[#aaa] border-gray-200 dark:border-zinc-700 black:border-[#2a2a2a] hover:border-[#ba7a4e] hover:text-[#ba7a4e] dark:hover:border-[#ba7a4e] dark:hover:text-[#ba7a4e]"
                  }`}
              >
                Semester {index + 1}
              </Link>
            );
          })}
        </div>

        <div className="mb-6 bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden">
          <div className="h-[3px] bg-[#ba7a4e]" />

          <div className="p-4 sm:p-5">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-zinc-100 black:text-white">
                  Daily Attendance
                </h2>

                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-zinc-400 black:text-[#777] mt-1">
                  Check attendance status for selected date.
                </p>
              </div>

              <div className="w-full lg:w-auto">
                <input
                  onChange={handleChangeDate}
                  type="date"
                  value={date}
                  name="attendance-date"
                  className="
            h-[42px]
            px-4
            rounded-xl
            border
            border-gray-200
            dark:border-zinc-700
            black:border-[#2a2a2a]
            bg-gray-50
            dark:bg-zinc-900
            black:bg-[#121212]
            text-sm
            text-gray-700
            dark:text-zinc-200
            black:text-white
            focus:outline-none
            focus:ring-2
            focus:ring-[#ba7a4e]/30
            focus:border-[#ba7a4e]
            transition-all
            duration-200
          "
                />

              </div>
            </div>

            <div className="space-y-3">
              {loading ? <div className="text-center py-8 text-[#ba7a4e] text-sm">Loading...</div> : specificAttendance.length > 0 ? specificAttendance.map((item, index) => {
                return <div key={index} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 dark:bg-zinc-700/30 black:bg-[#141414] border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] px-3 sm:px-4 py-3 transition-all hover:border-[#ba7a4e]/30">

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-100 black:text-white truncate">
                      {item.courseName}
                    </h3>

                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 black:text-[#555] mt-0.5">
                      {item.attendance}
                    </p>
                  </div>

                  <span className={`flex-shrink-0 w-8 h-8 rounded-full ${item.attendance === 'Present' ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" : item.attendance === 'Absent' ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"}  flex items-center justify-center text-sm font-bold border `}>
                    {item.attendance === 'Present' ? "P" : item.attendance === 'Absent' ? "A" : "L"}
                  </span>
                </div>
              }) : <div className="text-center text-gray-400 dark:text-zinc-500 text-sm">Not found attendance</div>}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {attendance?.courseAttendance?.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="h-[3px] bg-[#ba7a4e]" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-100 black:text-white leading-snug">{item?.courseName}</h2>
                    <p className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 black:text-[#555] mt-0.5">{item?.courseCode}</p>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${item?.percentage >= 75
                    ? "bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-400"
                    : item?.percentage >= 50
                      ? "bg-yellow-50 dark:bg-yellow-400/10 text-yellow-700 dark:text-yellow-400"
                      : "bg-red-50 dark:bg-red-400/10 text-red-600 dark:text-red-400"
                    }`}>
                    {item?.percentage}%
                  </span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-zinc-700 black:bg-[#1f1f1f] rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full transition-all ${item?.percentage >= 75 ? "bg-green-500"
                      : item?.percentage >= 50 ? "bg-yellow-500"
                        : "bg-red-500"
                      }`}
                    style={{ width: `${item?.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Classes Conducted:</span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-zinc-200 black:text-[#ccc]">{item?.classConducted}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Teacher:</span>
                  {item.teacherName
                    ? <span className="text-sm font-semibold text-gray-700 dark:text-zinc-200 black:text-[#ccc]">{item?.teacherName}</span>
                    : <span className="text-sm font-semibold text-red-500 dark:text-red-400">Not Assigned</span>
                  }
                </div>

                <button className="w-full h-[36px] flex items-center justify-center gap-1.5 bg-[#ba7a4e]/10 hover:bg-[#ba7a4e]/20 text-[#ba7a4e] border border-[#ba7a4e]/20 text-xs font-medium rounded-lg transition-all duration-150">
                  <MdOutlineExplore size={15} />
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden">
          <div className="h-[3px] bg-[#ba7a4e]" />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Overall Attendance</h2>
              <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${attendance?.overAllAttendance?.percentage >= 75
                ? "bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-400"
                : attendance?.overAllAttendance?.percentage >= 50
                  ? "bg-yellow-50 dark:bg-yellow-400/10 text-yellow-700 dark:text-yellow-400"
                  : "bg-red-50 dark:bg-red-400/10 text-red-600 dark:text-red-400"
                }`}>
                {attendance?.overAllAttendance?.percentage}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Classes Attended", value: attendance?.overAllAttendance?.classConducted },
                { label: "Total Classes", value: attendance?.overAllAttendance?.totalClassConducted },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 dark:bg-zinc-700/40 black:bg-[#141414] rounded-lg px-3 py-2">
                  <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444] mb-0.5">{label}</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-zinc-100 black:text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="w-full bg-gray-100 dark:bg-zinc-700 black:bg-[#1f1f1f] rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${attendance?.overAllAttendance?.percentage >= 75 ? "bg-green-500"
                  : attendance?.overAllAttendance?.percentage >= 50 ? "bg-yellow-500"
                    : "bg-red-500"
                  }`}
                style={{ width: `${attendance?.overAllAttendance?.percentage}%` }}
              />
            </div>
          </div>
        </div>

      </div>

    </>
  );
};

export default Academics;
