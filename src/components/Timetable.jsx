import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Timetable = () => {
  const [timetable, setTimetable] = useState({
    degreeTitle: "",
    semester: "",
    section: "",
    day: "",
    courseName: "",
    teacherName: "",
    roomNo: "",
    startTime: "",
    endTime: "",
    shift: ""
  });

  const [searchTerm, setSearchTerm] = useState("")

  const [timetableList, setTimetableList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Add timetable
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

      Swal.fire({
        title: response?.data?.message,
        icon: "success",
      });

      setTimetable({
        degreeTitle: "",
        semester: "",
        section: "",
        day: "",
        courseName: "",
        teacherName: "",
        roomNo: "",
        startTime: "",
        endTime: "",
        shift: ""
      });

      getTimetable();

    } catch (err) {
      Swal.fire({
        title: err?.response?.data?.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/api/v1/admin/timetable/${id}`);
          getTimetable();
          Swal.fire({
            title: response?.data?.message,
            icon: "success",
          });
        } catch (err) {
          Swal.fire({
            title: err?.response?.data?.message,
            icon: "error",
          });
        }
      }
    });
  };

  const filteredTimeTable = timetableList.filter((timetable) => {
    const term = searchTerm.toLowerCase();

    return (
      timetable?.degreeTitle.toLowerCase().includes(term) ||
      timetable?.courseName.toLowerCase().includes(term)
    )
  })

  useEffect(() => {
    getTimetable()
  }, [])


  return (
    <>
      {/* Main Lecture Page */}
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🎓 TimeTable Management</h1>
          <p className="text-sm text-gray-500">
            Add, view, and manage all timetables in the system.
          </p>
        </div>

        {/* Add Lecture Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-[#925fe2] text-3xl">+</span> Add New Timetable
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <div className="flex flex-col">
              <label
                htmlFor="degreeTitle"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Degree Title
              </label>
              <select
                onChange={handleChange}
                type="text"
                id="degreeTitle"
                name="degreeTitle"
                value={timetable.degreeTitle}
                placeholder="Enter Degree Title"
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
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

            <div className="flex flex-col">
              <label
                htmlFor="semester"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Semester
              </label>
              <select
                onChange={handleChange}
                type="text"
                id="semester"
                name="semester"
                value={timetable.semester}
                placeholder="Enter Semester"
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
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

            <div className="flex flex-col">
              <label
                htmlFor="courseCode"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Section
              </label>
              <select
                onChange={handleChange}
                type="text"
                id="section"
                name="section"
                value={timetable.section}
                placeholder="Select section"
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
              >
                <option value="">Select Section</option>
                <option>G1</option>
                <option>G2</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="courseCode"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Section
              </label>
              <select
                onChange={handleChange}
                type="text"
                id="day"
                name="day"
                value={timetable.day}
                placeholder="Select day"
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
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

            <div className="flex flex-col">
              <label
                htmlFor="courseName"
                className="text-sm font-medium text-gray-600 mb-1"
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
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="courseName"
                className="text-sm font-medium text-gray-600 mb-1"
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
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="courseName"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Room No.
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="roomNo"
                name="roomNo"
                value={timetable.roomNo}
                placeholder="Enter Room No."
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="courseName"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Start Time
              </label>
              <input
                onChange={handleChange}
                type="time"
                id="startTime"
                name="startTime"
                value={timetable.startTime}
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="courseName"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                End Time
              </label>
              <input
                onChange={handleChange}
                type="time"
                id="endTime"
                name="endTime"
                value={timetable.endTime}
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="courseCode"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Section
              </label>
              <select
                onChange={handleChange}
                type="text"
                id="shift"
                name="shift"
                value={timetable.shift}
                placeholder="Select Shift"
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
              >
                <option value="">Select Shift</option>
                <option>Morning</option>
                <option>Evening</option>
              </select>
            </div>



            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#925fe2] text-white font-medium px-6 py-2.5 rounded-lg shadow hover:bg-purple-700 transition duration-200"
              >
                {loading ? "Loading..." : "Add Timetable"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search by Course Code or Name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
          />
        </div>


        <div className="bg-white shadow-md rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-700">
                <th className="p-3">#</th>
                <th className="p-3">Degree Title</th>
                <th className="p-3">Semester</th>
                <th className="p-3">Section</th>
                <th className="p-3">Day</th>
                <th className="p-3">Course Name</th>
                <th className="p-3">Teacher Name</th>
                <th className="p-3">Room No.</th>
                <th className="p-3">Start Time</th>
                <th className="p-3">End Time</th>
                <th className="p-3">Shift</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimeTable.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center p-4">
                    No Timetable Record
                  </td>
                </tr>
              ) : (
                filteredTimeTable.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.degreeTitle}</td>
                    <td className="p-3">{item.semester}</td>
                    <td className="p-3">{item.section}</td>
                    <td className="p-3">{item.day}</td>
                    <td className="p-3">{item.courseName}</td>
                    <td className="p-3">{item.teacherName}</td>
                    <td className="p-3">{item.roomNo}</td>
                    <td className="p-3">{item.startTime}</td>
                    <td className="p-3">{item.endTime}</td>
                    <td className="p-3">{item.shift}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg shadow hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Timetable