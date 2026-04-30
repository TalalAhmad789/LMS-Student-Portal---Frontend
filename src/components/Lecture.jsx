import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Lecture = () => {

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

  const [lectureForm, setLectureForm] = useState({
    teacherId: "",
    courseCode: "",
    degreeTitle: "",
    section: "",
    shift: "",
    semester: ""
  });

  const [searchTerm, setSearchTerm] = useState("")

  const [teacherList, setTeacherList] = useState([])

  const [courseCode, setCourseCode] = useState([])

  const [lectureList, setLectureList] = useState([]);
  const [loading, setLoading] = useState(false);

  const sectionOptions = ["G1", "G2"];
  const shiftOptions = ["Morning", "Evening"];

  const getLectureList = async () => {
    try {
      const response = await axios.get("/api/v1/admin/lectures");
      if (response?.data?.success) {
        setLectureList(response?.data?.data?.lectures);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const getCourseCode = async () => {
    try {
      const response = await axios.get('/api/v1/admin/courses', { withCredentials: true });
      if (response?.data?.success) {
        setCourseCode(response?.data?.data?.courses?.map((item, index) => {
          return item.courseCode
        }));
      }
    } catch (error) {
      console.log(err?.response?.data?.message);
    }
  }

  const getTeacher = async () => {
    try {
      const response = await axios.get("/api/v1/admin/teachers");
      if (response?.data?.success) {
        setTeacherList(response?.data?.data?.teachers);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLectureForm({ ...lectureForm, [name]: value });
  };

  const handleDelay = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay * 1000));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await handleDelay(3);
      const response = await axios.post("/api/v1/admin/lecture/add", lectureForm);
      if (response?.data?.success) {
        await Swal.fire({
          title: response?.data?.message,
          icon: "success",
          draggable: true,
          theme: isDark ? "dark" : "light"
        });
        setLectureForm({
          teacherId: "",
          courseCode: "",
          degreeTitle: "",
          section: "",
          shift: "",
          semester: ""
        });
        getLectureList();
      }
    } catch (error) {
      await Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
        draggable: true,
        theme: isDark ? "dark" : "light"
      });
    } finally {
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
          const response = await axios.delete(`/api/v1/admin/lecture/${id}`);
          if (response?.data?.success) {
            await handleDelay(2)
            setLectureList(lectureList.filter(item => item._id !== id));
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
        }
      }
    });
  };

  const filteredLecture = lectureList.filter((lecture) => {
    const term = searchTerm.toLowerCase();

    return (
      lecture?.teacherId.toLowerCase().includes(term) ||
      lecture?.courseCode.toLowerCase().includes(term) ||
      lecture?.degreeTitle.toLowerCase().includes(term)
    )
  })

  const totalLectures = lectureList.length;

  useEffect(() => {
    getLectureList();
    getTeacher();
    getCourseCode();
  }, []);

  return (
    // <>
    //   {/* Main Lecture Page */}
    //   <div className="p-6">
    //     <div className="mb-6">
    //       <h1 className="text-2xl font-bold text-gray-800">📘 Lecture Management</h1>
    //       <p className="text-sm text-gray-500">
    //         Add, view, and manage all registered lectures in the system.
    //       </p>
    //     </div>

    //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    //       <div className="bg-white rounded-xl shadow p-4 border">
    //         <h3 className="text-sm text-gray-500">Total Lectures</h3>
    //         <p className="text-2xl font-bold text-[#925fe2]">{totalLectures}</p>
    //       </div>
    //     </div>

    //     {/* Add Lecture Form */}
    //     <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-100">
    //       <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
    //         <span className="text-[#925fe2] text-3xl">+</span> Add New Lecture
    //       </h2>

    //       <form
    //         onSubmit={handleSubmit}
    //         className="grid grid-cols-1 md:grid-cols-2 gap-6"
    //       >
    //         {/* Teacher ID Dropdown */}
    //         <div className="flex flex-col">
    //           <label
    //             htmlFor="teacherId"
    //             className="text-sm font-medium text-gray-600 mb-1"
    //           >
    //             Teacher ID
    //           </label>
    //           <select
    //             onChange={handleChange}
    //             id="teacherId"
    //             name="teacherId"
    //             value={lectureForm.teacherId}
    //             className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
    //           >
    //             <option value="">Select Teacher ID</option>
    //             {teacherList.map((item, i) => (
    //               <option key={i} value={item?.teacherId}>
    //                 {item?.teacherId}
    //               </option>
    //             ))}
    //           </select>
    //         </div>

    //         {/* Course Code */}
    //         <div className="flex flex-col">
    //           <label
    //             htmlFor="courseCode"
    //             className="text-sm font-medium text-gray-600 mb-1"
    //           >
    //             Course Code
    //           </label>
    //           <select
    //             onChange={handleChange}
    //             type="text"
    //             id="courseCode"
    //             name="courseCode"
    //             value={lectureForm.courseCode}
    //             placeholder="Enter Degree Title"
    //             className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
    //           >
    //             <option value="">Select Course Code</option>
    //             {courseCode.map((item, index) => {
    //               return <option key={index}>{item}</option>
    //             })}
    //           </select>
    //         </div>

    //         {/* Degree Title */}
    //         <div className="flex flex-col">
    //           <label
    //             htmlFor="degreeTitle"
    //             className="text-sm font-medium text-gray-600 mb-1"
    //           >
    //             Degree Title
    //           </label>
    //           <select
    //             onChange={handleChange}
    //             type="text"
    //             id="degreeTitle"
    //             name="degreeTitle"
    //             value={lectureForm.degreeTitle}
    //             placeholder="Enter Degree Title"
    //             className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
    //           >
    //             <option value="">Select Program</option>
    //             <option>BSCS</option>
    //             <option>BSIT</option>
    //             <option>BSPHY</option>
    //             <option>BSCHEM</option>
    //             <option>BSISL</option>
    //             <option>BSENG</option>
    //           </select>
    //         </div>

    //         <div className="flex flex-col">
    //           <label
    //             htmlFor="degreeTitle"
    //             className="text-sm font-medium text-gray-600 mb-1"
    //           >
    //             Semester
    //           </label>
    //           <select
    //             onChange={handleChange}
    //             type="text"
    //             id="semester"
    //             name="semester"
    //             value={lectureForm.semester}
    //             placeholder="Enter Semester"
    //             className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
    //           >
    //             <option value="">Select Program</option>
    //             <option>1</option>
    //             <option>2</option>
    //             <option>3</option>
    //             <option>4</option>
    //             <option>5</option>
    //             <option>6</option>
    //             <option>7</option>
    //             <option>8</option>
    //           </select>
    //         </div>

    //         {/* Section Dropdown */}
    //         <div className="flex flex-col">
    //           <label
    //             htmlFor="section"
    //             className="text-sm font-medium text-gray-600 mb-1"
    //           >
    //             Section
    //           </label>
    //           <select
    //             onChange={handleChange}
    //             id="section"
    //             name="section"
    //             value={lectureForm.section}
    //             className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
    //           >
    //             <option value="">Select Section</option>
    //             {sectionOptions.map((sec, i) => (
    //               <option key={i} value={sec}>
    //                 {sec}
    //               </option>
    //             ))}
    //           </select>
    //         </div>

    //         {/* Shift Dropdown */}
    //         <div className="flex flex-col">
    //           <label
    //             htmlFor="shift"
    //             className="text-sm font-medium text-gray-600 mb-1"
    //           >
    //             Shift
    //           </label>
    //           <select
    //             onChange={handleChange}
    //             id="shift"
    //             name="shift"
    //             value={lectureForm.shift}
    //             className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
    //           >
    //             <option value="">Select Shift</option>
    //             {shiftOptions.map((shift, i) => (
    //               <option key={i} value={shift}>
    //                 {shift}
    //               </option>
    //             ))}
    //           </select>
    //         </div>

    //         <div className="md:col-span-2 flex justify-end">
    //           <button
    //             type="submit"
    //             className="bg-[#925fe2] text-white font-medium px-6 py-2.5 rounded-lg shadow hover:bg-purple-700 transition duration-200"
    //           >
    //             {loading ? "Loading..." : "Add Lecture"}
    //           </button>
    //         </div>
    //       </form>
    //     </div>

    //     <div className="bg-white shadow-md rounded-xl p-4 mb-6">
    //       <input
    //         type="text"
    //         value={searchTerm}
    //         onChange={(e) => setSearchTerm(e.target.value)}
    //         placeholder="🔍 Search by Teacher ID or Course Code or Degree..."
    //         className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#925fe2] focus:border-[#925fe2] outline-none transition"
    //       />
    //     </div>

    //     {/* Lecture Table */}
    //     <div className="bg-white shadow-md rounded-xl overflow-x-auto">
    //       <table className="w-full text-left border-collapse">
    //         <thead>
    //           <tr className="bg-gray-100 text-gray-700">
    //             <th className="p-3">#</th>
    //             <th className="p-3">Teacher ID</th>
    //             <th className="p-3">Course Code</th>
    //             <th className="p-3">Degree Title</th>
    //             <th className="p-3">Semester</th>
    //             <th className="p-3">Section</th>
    //             <th className="p-3">Shift</th>
    //             <th className="p-3">Actions</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {filteredLecture.length === 0 ? (
    //             <tr>
    //               <td colSpan="7" className="text-center p-4">
    //                 No Lecture Record
    //               </td>
    //             </tr>
    //           ) : (
    //             filteredLecture.map((item, index) => (
    //               <tr key={index} className="border-t hover:bg-gray-50">
    //                 <td className="p-3">{index + 1}</td>
    //                 <td className="p-3">{item.teacherId}</td>
    //                 <td className="p-3">{item.courseCode}</td>
    //                 <td className="p-3">{item.degreeTitle}</td>
    //                 <td className="p-3">{item.semester}</td>
    //                 <td className="p-3">{item.section}</td>
    //                 <td className="p-3">{item.shift}</td>
    //                 <td className="p-3 flex gap-2">
    //                   <button
    //                     onClick={() => handleDelete(item._id)}
    //                     className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg shadow hover:bg-red-700"
    //                   >
    //                     Remove
    //                   </button>
    //                 </td>
    //               </tr>
    //             ))
    //           )}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </>
    <>
      {/* Main Lecture Page */}
      <div className="p-6 bg-gray-50 dark:bg-zinc-900 black:bg-black min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 black:text-white">📘 Lecture Management</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">
            Add, view, and manage all registered lectures in the system.
          </p>
        </div>

        {/* Stat Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
            <h3 className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">Total Lectures</h3>
            <p className="text-2xl font-bold text-[#ba7a4e]">{totalLectures}</p>
          </div>
        </div>

        {/* Add Lecture Form */}
        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-xl rounded-2xl p-8 mb-10 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white mb-6 flex items-center gap-2">
            <span className="text-[#ba7a4e] text-3xl">+</span> Add New Lecture
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Teacher ID Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="teacherId" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                Teacher ID
              </label>
              <select
                onChange={handleChange}
                id="teacherId"
                name="teacherId"
                value={lectureForm.teacherId}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              >
                <option value="">Select Teacher ID</option>
                {teacherList.map((item, i) => (
                  <option key={i} value={item?.teacherId}>
                    {item?.teacherId}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Code */}
            <div className="flex flex-col">
              <label htmlFor="courseCode" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                Course Code
              </label>
              <select
                onChange={handleChange}
                id="courseCode"
                name="courseCode"
                value={lectureForm.courseCode}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              >
                <option value="">Select Course Code</option>
                {courseCode.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>

            {/* Degree Title */}
            <div className="flex flex-col">
              <label htmlFor="degreeTitle" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                Degree Title
              </label>
              <select
                onChange={handleChange}
                id="degreeTitle"
                name="degreeTitle"
                value={lectureForm.degreeTitle}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
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
              <label htmlFor="semester" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                Semester
              </label>
              <select
                onChange={handleChange}
                id="semester"
                name="semester"
                value={lectureForm.semester}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
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
              <label htmlFor="section" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                Section
              </label>
              <select
                onChange={handleChange}
                id="section"
                name="section"
                value={lectureForm.section}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              >
                <option value="">Select Section</option>
                {sectionOptions.map((sec, i) => (
                  <option key={i} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            {/* Shift */}
            <div className="flex flex-col">
              <label htmlFor="shift" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                Shift
              </label>
              <select
                onChange={handleChange}
                id="shift"
                name="shift"
                value={lectureForm.shift}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              >
                <option value="">Select Shift</option>
                {shiftOptions.map((shift, i) => (
                  <option key={i} value={shift}>{shift}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#ba7a4e] hover:bg-[#a06840] text-white font-medium px-6 py-2.5 rounded-lg shadow transition duration-200"
              >
                {loading ? "Loading..." : "Add Lecture"}
              </button>
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-md rounded-xl p-4 mb-6 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search by Teacher ID or Course Code or Degree..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
          />
        </div>

        {/* Lecture Table */}
        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-md rounded-xl overflow-x-auto border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-zinc-700/60 black:bg-[#141414] text-gray-700 dark:text-zinc-300 black:text-[#555] text-sm uppercase tracking-wide">
                <th className="p-3">#</th>
                <th className="p-3">Teacher ID</th>
                <th className="p-3">Course Code</th>
                <th className="p-3">Degree Title</th>
                <th className="p-3">Semester</th>
                <th className="p-3">Section</th>
                <th className="p-3">Shift</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLecture.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-gray-400 dark:text-zinc-500 black:text-[#333]">
                    No Lecture Record
                  </td>
                </tr>
              ) : (
                filteredLecture.map((item, index) => (
                  <tr key={index} className="border-t border-gray-100 dark:border-zinc-700 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/40 black:hover:bg-[#141414] text-gray-800 dark:text-zinc-200 black:text-[#ccc] transition-colors">
                    <td className="p-3 text-gray-400 dark:text-zinc-500 black:text-[#3a3a3a]">{index + 1}</td>
                    <td className="p-3 font-semibold text-[#ba7a4e]">{item.teacherId}</td>
                    <td className="p-3 font-medium">{item.courseCode}</td>
                    <td className="p-3">{item.degreeTitle}</td>
                    <td className="p-3">{item.semester}</td>
                    <td className="p-3">{item.section}</td>
                    <td className="p-3">{item.shift}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 black:bg-red-500/10 black:hover:bg-red-500/20 black:text-red-500 text-white rounded-lg transition"
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
};

export default Lecture;