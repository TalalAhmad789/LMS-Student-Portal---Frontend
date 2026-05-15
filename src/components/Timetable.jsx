import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdDelete, MdLockReset } from "react-icons/md";


const Timetable = () => {

  const getTheme = () => {
    if (document.documentElement.classList.contains("dark")) return "dark";
    return "light";
  };

  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  const [timetable, setTimetable] = useState({
    degreeTitle: "",
    semester: "",
    section: "",
    day: "",
    courseName: "",
    courseCode: "",
    teacherName: "",
    startTime: "",
    endTime: "",
    shift: ""
  });

  const [searchTerm, setSearchTerm] = useState("")

  const [timetableList, setTimetableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [filters, setFilters] = useState({
    degreeTitle: "",
    section: "",
    shift: "",
    semester: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const timetablePerPage = 10;

  const [filteredTimetables, setFilteredTimetables] = useState(timetableList);

  const indexOfLastTimetable = currentPage * timetablePerPage;
  const indexOfFirstTimetable = indexOfLastTimetable - timetablePerPage;

  const totalPages = Math.ceil(filteredTimetables.length / timetablePerPage);

  const currentTimetables = filteredTimetables.slice(
    indexOfFirstTimetable,
    indexOfLastTimetable
  )

  const getTimetable = async () => {
    await axios.get("/api/v1/admin/timetables", { withCredentials: true }).then((response) => {
      setTimetableList(response?.data?.data?.timetables)
    }).catch((error) => {
      console.log(error?.response?.data?.message)
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimetable({ ...timetable, [name]: value });
  };

  const handleDelay = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay * 1000));


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await handleDelay(3);

      const response = await axios.post(
        "/api/v1/admin/timetable/add",
        timetable,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        await Swal.fire({
          title: response?.data?.message,
          icon: "success",
          draggable: true,
          theme: isDark ? "dark" : "light"
        });
      }

    } catch (err) {
      await Swal.fire({
        title: err?.response?.data?.message,
        icon: "error",
        draggable: true,
        theme: isDark ? "dark" : "light"
      });
    } finally {
      setTimetable({
        degreeTitle: "",
        semester: "",
        section: "",
        day: "",
        courseName: "",
        teacherName: "",
        courseCode: "",
        startTime: "",
        endTime: "",
        shift: ""
      });
      getTimetable();
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      theme: isDark ? "dark" : "light"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/api/v1/admin/timetable/${id}`);
          if (response?.data?.success) {
            setTimetableList(timetableList.filter(t => t._id !== id));
            await Swal.fire({
              title: response?.data?.message,
              icon: "success",
              draggable: true,
              theme: isDark ? "dark" : "light"
            });
          }
        } catch (err) {
          await Swal.fire({
            title: err?.response?.data?.message,
            icon: "error",
            draggable: true,
            theme: isDark ? "dark" : "light"
          });
        }
      }
    });
  };

  const handleFilter = async () => {
    setLoading2(true);
    await handleDelay(2);

    const result = timetableList.filter((timetable) => {
      return (
        timetable.degreeTitle.toLowerCase().includes(filters.degreeTitle.toLowerCase()) &&
        timetable.semester.toString().toLowerCase().includes(filters.semester.toLowerCase()) &&
        timetable.section.toLowerCase().includes(filters.section.toLowerCase()) &&
        timetable.shift.toLowerCase().includes(filters.shift.toLowerCase())
      );
    });

    setFilteredTimetables(result);
    setCurrentPage(1);
    setLoading2(false);
  };

  useEffect(() => {
    getTimetable()
  }, [])

  useEffect(() => {
    setFilteredTimetables(timetableList)
  }, [timetableList])

  return (
    <>
      <div className="p-6 bg-gray-50 dark:bg-zinc-900 min-h-screen">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100">
            🎓 Timetable Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Add, view, and manage all timetables in the system.
          </p>
        </div>

        {/* Add Timetable Form */}
        <div className="bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-8 mb-10 border border-gray-100 dark:border-zinc-700">

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
            <span className="text-[#ba7a4e] text-3xl">+</span>
            Add New Timetable
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* Degree Title */}
            <div className="flex flex-col">
              <label
                htmlFor="degreeTitle"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                Degree Title
              </label>

              <select
                onChange={handleChange}
                id="degreeTitle"
                name="degreeTitle"
                value={timetable.degreeTitle}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              >
                <option value="">Select Program</option>
                <option>BSCS</option>
                <option>BSIT</option>
                <option>BSPHY</option>
                <option>BSCHEM</option>
                <option>BSISL</option>
                <option>BSENG</option>
              </select>
            </div>

            {/* Semester */}
            <div className="flex flex-col">
              <label
                htmlFor="semester"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                Semester
              </label>

              <select
                onChange={handleChange}
                id="semester"
                name="semester"
                value={timetable.semester}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              >
                <option value="">Select Semester</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
              </select>
            </div>

            {/* Section */}
            <div className="flex flex-col">
              <label
                htmlFor="section"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                Section
              </label>

              <select
                onChange={handleChange}
                id="section"
                name="section"
                value={timetable.section}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              >
                <option value="">Select Section</option>
                <option>G1</option>
                <option>G2</option>
              </select>
            </div>

            {/* Day */}
            <div className="flex flex-col">
              <label
                htmlFor="day"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                Day
              </label>

              <select
                onChange={handleChange}
                id="day"
                name="day"
                value={timetable.day}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              >
                <option value="">Select Day</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>
            </div>

            {/* Shift */}
            <div className="flex flex-col">
              <label
                htmlFor="shift"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                Shift
              </label>

              <select
                onChange={handleChange}
                id="shift"
                name="shift"
                value={timetable.shift}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              >
                <option value="">Select Shift</option>
                <option>Morning</option>
                <option>Evening</option>
              </select>
            </div>

            {/* Course Name */}
            <div className="flex flex-col">
              <label
                htmlFor="courseName"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                Course Name
              </label>

              <input
                onChange={handleChange}
                type="text"
                id="courseName"
                name="courseName"
                value={timetable.courseName}
                placeholder="Enter Course Name"
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
            </div>

            {/* Course Code */}
            <div className="flex flex-col">
              <label
                htmlFor="courseCode"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                Course Code
              </label>

              <input
                onChange={handleChange}
                type="text"
                id="courseCode"
                name="courseCode"
                value={timetable.courseCode}
                placeholder="Enter Course Code"
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
            </div>

            {/* Teacher Name */}
            <div className="flex flex-col">
              <label
                htmlFor="teacherName"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                Teacher Name
              </label>

              <input
                onChange={handleChange}
                type="text"
                id="teacherName"
                name="teacherName"
                value={timetable.teacherName}
                placeholder="Enter Teacher Name"
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
            </div>

            {/* Start Time */}
            <div className="flex flex-col">
              <label
                htmlFor="startTime"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                Start Time
              </label>

              <input
                onChange={handleChange}
                type="time"
                id="startTime"
                name="startTime"
                value={timetable.startTime}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
            </div>

            {/* End Time */}
            <div className="flex flex-col">
              <label
                htmlFor="endTime"
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1"
              >
                End Time
              </label>

              <input
                onChange={handleChange}
                type="time"
                id="endTime"
                name="endTime"
                value={timetable.endTime}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#ba7a4e] hover:bg-[#a06840] text-white font-medium px-6 py-2.5 rounded-lg shadow transition duration-200"
              >
                {loading ? "Loading..." : "Add Timetable"}
              </button>
            </div>

          </form>
        </div>

        <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-4 mb-6 border border-gray-100 dark:border-zinc-700">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

            {/* Degree Title */}
            <select
              value={filters.degreeTitle}
              onChange={(e) =>
                setFilters({ ...filters, degreeTitle: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
            >
              <option value="">Select Degree</option>
              <option value="BSCS">BSCS</option>
              <option value="BSIT">BSIT</option>
              <option value="BSPHY">BSPHY</option>
              <option value="BSCHEM">BSCHEM</option>
              <option value="BSISL">BSISL</option>
              <option value="BSENG">BSENG</option>
            </select>

            {/* Semester */}
            <select
              value={filters.semester}
              onChange={(e) =>
                setFilters({ ...filters, semester: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
            >
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>

            {/* Section */}
            <select
              value={filters.section}
              onChange={(e) =>
                setFilters({ ...filters, section: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
            >
              <option value="">Select Section</option>
              <option value="G1">G1</option>
              <option value="G2">G2</option>
            </select>

            {/* Shift */}
            <select
              value={filters.shift}
              onChange={(e) =>
                setFilters({ ...filters, shift: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
            >
              <option value="">Select Shift</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>

            <div className="flex gap-2">

              <button
                onClick={handleFilter}
                className="flex-1 bg-[#ba7a4e] hover:bg-[#a86a3f] text-white font-medium rounded-lg px-4 py-3 transition"
              >
                {loading2 ? "Filtering..." : "Apply"}
              </button>

              <button
                onClick={() => {
                  setFilters({
                    degreeTitle: "",
                    semester: "",
                    shift: "",
                    section: ""
                  });
                  setFilteredTimetables(timetableList);
                  setCurrentPage(1);
                }}
                className="flex-1 bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-500 font-medium rounded-lg px-4 py-3 transition"
              >
                Reset
              </button>

            </div>

          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl overflow-x-auto border border-gray-100 dark:border-zinc-700">

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-zinc-700/60 text-gray-700 dark:text-zinc-300 text-[12px] uppercase tracking-wide">
                <th className="p-2">#</th>
                <th className="p-2">Degree Title</th>
                <th className="p-2">Semester</th>
                <th className="p-2">Section</th>
                <th className="p-2">Day</th>
                <th className="p-2">Course Name</th>
                <th className="p-2">Course Code</th>
                <th className="p-2">Teacher Name</th>
                <th className="p-2">Start Time</th>
                <th className="p-2">End Time</th>
                <th className="p-2">Shift</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading3 ? <tr>
                <td colSpan="12" className="text-center p-6 text-[#ba7a4e]">Loading...</td>
              </tr> : filteredTimetables.length === 0 ? (
                <tr>
                  <td
                    colSpan="12"
                    className="text-center p-6 text-gray-400 dark:text-zinc-500"
                  >
                    No Timetable Record
                  </td>
                </tr>
              ) : (
                currentTimetables.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t text-[12px] border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/40 text-gray-800 dark:text-zinc-200 transition-colors"
                  >
                    <td className="p-2">{indexOfFirstTimetable + index + 1}</td>
                    <td className="p-2">{item.degreeTitle}</td>
                    <td className="p-2">{item.semester}</td>
                    <td className="p-2">{item.section}</td>
                    <td className="p-2">{item.day}</td>
                    <td className="p-2">{item.courseName}</td>
                    <td className="p-3 font-semibold text-[#ba7a4e]">
                      {item.courseCode}
                    </td>
                    <td className="p-2">{item.teacherName}</td>
                    <td className="p-2">{item.startTime}</td>
                    <td className="p-2">{item.endTime}</td>
                    <td className="p-2">{item.shift}</td>

                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 text-white rounded-lg transition"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">

            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-gray-700 dark:text-zinc-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      </div>

    </>
  );
}

export default Timetable