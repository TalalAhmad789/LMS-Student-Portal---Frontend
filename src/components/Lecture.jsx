import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdDelete, MdOutlineClass } from "react-icons/md";

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
  const [errors, setErrors] = useState({});



  const [lectureForm, setLectureForm] = useState({
    teacherId: "",
    courseCode: "",
    degreeTitle: "",
    section: "",
    shift: "",
    semester: ""
  });

  const [filters, setFilters] = useState({
    teacherId: "",
    courseCode: "",
    degreeTitle: ""
  });

  const validate = () => {
    let newErrors = {};

    if (!lectureForm.teacherId.trim()) {
      newErrors.teacherId = "Teacher ID is required";
    }

    if (!lectureForm.courseCode.trim()) {
      newErrors.courseCode = "Course code is required";
    }

    if (!lectureForm.degreeTitle.trim()) {
      newErrors.degreeTitle = "Please select a program";
    }

    if (!lectureForm.semester.trim()) {
      newErrors.semester = "Semester is required";
    }

    if (!lectureForm.section.trim()) {
      newErrors.section = "Section is required";
    }

    if (!lectureForm.shift.trim()) {
      newErrors.shift = "Shift is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const [searchTerm, setSearchTerm] = useState("")

  const [teacherList, setTeacherList] = useState([])

  const [courseCode, setCourseCode] = useState([])

  const [lectureList, setLectureList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const lecturePerPage = 10;

  const [filteredLectures, setFilteredLectures] = useState(lectureList);

  const indexOfLastLecture = currentPage * lecturePerPage;
  const indexOfFirstLecture = indexOfLastLecture - lecturePerPage;

  const totalPages = Math.ceil(filteredLectures.length / lecturePerPage);

  const currentLectures = filteredLectures.slice(
    indexOfFirstLecture,
    indexOfLastLecture
  )


  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const sectionOptions = ["G1", "G2"];
  const shiftOptions = ["Morning", "Evening"];

  const getLectureList = async () => {
    setLoading2(true)
    try {
      const response = await axios.get("/api/v1/admin/lectures");
      if (response?.data?.success) {
        setLectureList(response?.data?.data?.lectures);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      setLoading2(false)
    } finally {
      setLoading2(false)
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
    if (!validate()) return;
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

  const handleFilter = async () => {

    setLoading1(true);
    await handleDelay(2);

    const result = lectureList.filter((lecture) => {
      return (
        lecture.teacherId.toLowerCase().includes(filters.teacherId.toLowerCase()) &&
        lecture.courseCode.toLowerCase().includes(filters.courseCode.toLowerCase()) &&
        lecture.degreeTitle.toLowerCase().includes(filters.degreeTitle.toLowerCase())
      );
    });

    setFilteredLectures(result);
    setCurrentPage(1);
    setLoading1(false);
  };

  const totalLectures = lectureList.length;

  useEffect(() => {
    getLectureList();
    getTeacher();
    getCourseCode();
  }, []);

  useEffect(() => {
    setFilteredLectures(lectureList);
  }, [lectureList]);

  return (
    <>
      <div className="w-full h-[3px] bg-[#ba7a4e]" />
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen">

        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
            <MdOutlineClass size={22} />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Lecture Management</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
              Add, view, and manage all registered lectures in the system.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl p-3 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
            <p className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#666] mb-1">Total</p>
            <p className="text-2xl font-bold text-[#ba7a4e]">{totalLectures}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-5">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
            <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e] text-lg font-bold leading-none">+</span>
            <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">Add New Lecture</h2>
          </div>
          <div className="p-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="flex flex-col gap-1.5">
                <label htmlFor="teacherId" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Teacher ID</label>
                <select
                  onChange={handleChange}
                  id="teacherId"
                  name="teacherId"
                  value={lectureForm.teacherId}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                >
                  <option value="">Select Teacher ID</option>
                  {teacherList.map((item, i) => (
                    <option key={i} value={item?.teacherId}>{item?.teacherId}</option>
                  ))}
                </select>
                {errors.teacherId && <p className="text-red-500 text-xs">{errors.teacherId}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="courseCode" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Course Code</label>
                <select
                  onChange={handleChange}
                  id="courseCode"
                  name="courseCode"
                  value={lectureForm.courseCode}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                >
                  <option value="">Select Course Code</option>
                  {courseCode.map((item, index) => (
                    <option key={index}>{item}</option>
                  ))}
                </select>
                {errors.courseCode && <p className="text-red-500 text-xs">{errors.courseCode}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="degreeTitle" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Degree Title</label>
                <select
                  onChange={handleChange}
                  id="degreeTitle"
                  name="degreeTitle"
                  value={lectureForm.degreeTitle}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                >
                  <option value="">Select Program</option>
                  <option>CS</option><option>IT</option><option>PHY</option>
                  <option>CHEM</option><option>ISL</option><option>ENG</option>
                </select>
                {errors.degreeTitle && <p className="text-red-500 text-xs">{errors.degreeTitle}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="semester" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Semester</label>
                <select
                  onChange={handleChange}
                  id="semester"
                  name="semester"
                  value={lectureForm.semester}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>{n}</option>)}
                </select>
                {errors.semester && <p className="text-red-500 text-xs">{errors.semester}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="section" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Section</label>
                <select
                  onChange={handleChange}
                  id="section"
                  name="section"
                  value={lectureForm.section}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                >
                  <option value="">Select Section</option>
                  {sectionOptions.map((sec, i) => (
                    <option key={i} value={sec}>{sec}</option>
                  ))}
                </select>
                {errors.section && <p className="text-red-500 text-xs">{errors.section}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="shift" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Shift</label>
                <select
                  onChange={handleChange}
                  id="shift"
                  name="shift"
                  value={lectureForm.shift}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
                >
                  <option value="">Select Shift</option>
                  {shiftOptions.map((shift, i) => (
                    <option key={i} value={shift}>{shift}</option>
                  ))}
                </select>
                {errors.shift && <p className="text-red-500 text-xs">{errors.shift}</p>}
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="h-[40px] px-6 flex items-center gap-2 bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow transition-all duration-150"
                >
                  {loading ? "Adding..." : "Add Lecture"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              value={filters.teacherId}
              onChange={(e) => setFilters({ ...filters, teacherId: e.target.value })}
              placeholder="Teacher ID"
              className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
            />
            <input
              type="text"
              value={filters.courseCode}
              onChange={(e) => setFilters({ ...filters, courseCode: e.target.value })}
              placeholder="Course Code"
              className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
            />
            <input
              type="text"
              value={filters.degreeTitle}
              onChange={(e) => setFilters({ ...filters, degreeTitle: e.target.value })}
              placeholder="Degree Title"
              className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition"
            />
            <div className="flex gap-2">
              <button
                onClick={handleFilter}
                className="flex-1 h-[40px] bg-[#ba7a4e] hover:bg-[#a06840] text-white text-sm font-medium rounded-lg transition"
              >
                {loading1 ? "Filtering..." : "Apply"}
              </button>
              <button
                onClick={() => { setFilters({ teacherId: "", courseCode: "", degreeTitle: "" }); setFilteredLectures(lectureList); setCurrentPage(1); }}
                className="flex-1 h-[40px] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] text-gray-700 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-200 dark:hover:bg-zinc-600 text-sm font-medium rounded-lg transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-700/50 black:bg-[#141414] border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
                  {["#", "Teacher ID", "Course Code", "Degree Title", "Semester", "Section", "Shift", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading2 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-[#ba7a4e] text-sm">Loading...</td>
                  </tr>
                ) : filteredLectures.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-400 dark:text-zinc-600 black:text-[#333] text-sm">No lecture records found</td>
                  </tr>
                ) : currentLectures.map((item, index) => (
                  <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/30 black:hover:bg-[#141414] transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-600 black:text-[#444]">{indexOfFirstLecture + index + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{item.teacherId}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white whitespace-nowrap">{item.courseCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.degreeTitle}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.semester}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.section}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.shift}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-lg transition"
                        title="Delete"
                      >
                        <MdDelete size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 px-4 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>
            <span className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#666]">
              Page <span className="font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">{currentPage}</span> of <span className="font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 px-4 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lecture;