import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdDelete, MdTableChart } from "react-icons/md";
import Footer from "../components/Footer";
import { useToast } from '../hooks/useToast.js'

const Timetable = () => {

  const { showSuccessToast, showErrorToast, showConfimationToast } = useToast()
  const [timetable, setTimetable] = useState({
    degreeTitle: "", semester: "", section: "", day: "",
    courseName: "", courseCode: "", teacherName: "",
    startTime: "", endTime: "", shift: ""
  });

  const [timetableList, setTimetableList] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [filters, setFilters] = useState({ degreeTitle: "", semester: "", section: "", shift: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const timetablePerPage = 10;

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const indexOfLastTimetable = currentPage * timetablePerPage;
  const indexOfFirstTimetable = indexOfLastTimetable - timetablePerPage;
  const totalPages = Math.max(1, Math.ceil(filteredTimetables.length / timetablePerPage));
  const currentTimetables = filteredTimetables.slice(indexOfFirstTimetable, indexOfLastTimetable);

  const getTimetable = async () => {
    setLoading3(true);
    await axios.get("/api/v1/admin/timetables", { withCredentials: true })
      .then((res) => { setTimetableList(res?.data?.data?.timetables); })
      .catch((err) => console.log(err?.response?.data?.message))
      .finally(() => setLoading3(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimetable({ ...timetable, [name]: value });
  };

  const handleDelay = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await handleDelay(3);
      const response = await axios.post("/api/v1/admin/timetable/add", timetable, { withCredentials: true });
      if (response?.data?.success) {
        await showSuccessToast(response?.data?.message);
      }
    } catch (err) {
      await showErrorToast(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setTimetable({ degreeTitle: "", semester: "", section: "", day: "", courseName: "", teacherName: "", courseCode: "", startTime: "", endTime: "", shift: "" });
      getTimetable();
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfimationToast("Yes, delete it!");
    if (!result.isConfirmed) return;
    try {
      const response = await axios.delete(`/api/v1/admin/timetable/${id}`);
      if (response?.data?.success) {
        setTimetableList(timetableList.filter(t => t._id !== id));
        await showSuccessToast(response?.data?.message);
      }
    } catch (err) {
      await showErrorToast(err?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleFilter = async () => {
    setLoading2(true);
    await handleDelay(2);
    const result = timetableList.filter((t) =>
      t.degreeTitle.toLowerCase().includes(filters.degreeTitle.toLowerCase()) &&
      t.semester.toString().toLowerCase().includes(filters.semester.toLowerCase()) &&
      t.section.toLowerCase().includes(filters.section.toLowerCase()) &&
      t.shift.toLowerCase().includes(filters.shift.toLowerCase())
    );
    setFilteredTimetables(result);
    setCurrentPage(1);
    setLoading2(false);
  };

  useEffect(() => { getTimetable(); }, []);
  useEffect(() => { setFilteredTimetables(timetableList); }, [timetableList]);

  const inputCls = "h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition";
  const labelCls = "text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]";

  return (
    <>
      <div className="w-full h-[3px] bg-[#ba7a4e]" />
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen">

        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
            <MdTableChart size={22} />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Timetable Management</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
              Add, view, and manage all timetables in the system.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-5">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
            <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e] text-lg font-bold leading-none">+</span>
            <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">Add New Timetable</h2>
          </div>
          <div className="p-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="flex flex-col gap-1.5">
                <label htmlFor="degreeTitle" className={labelCls}>Degree Title</label>
                <select onChange={handleChange} id="degreeTitle" name="degreeTitle" value={timetable.degreeTitle} className={inputCls}>
                  <option value="">Select Program</option>
                  <option>BSCS</option><option>BSIT</option><option>BSPHY</option>
                  <option>BSCHEM</option><option>BSISL</option><option>BSENG</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="semester" className={labelCls}>Semester</label>
                <select onChange={handleChange} id="semester" name="semester" value={timetable.semester} className={inputCls}>
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="section" className={labelCls}>Section</label>
                <select onChange={handleChange} id="section" name="section" value={timetable.section} className={inputCls}>
                  <option value="">Select Section</option>
                  <option>G1</option><option>G2</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="day" className={labelCls}>Day</label>
                <select onChange={handleChange} id="day" name="day" value={timetable.day} className={inputCls}>
                  <option value="">Select Day</option>
                  <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                  <option>Thursday</option><option>Friday</option><option>Saturday</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="shift" className={labelCls}>Shift</label>
                <select onChange={handleChange} id="shift" name="shift" value={timetable.shift} className={inputCls}>
                  <option value="">Select Shift</option>
                  <option>Morning</option><option>Evening</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="courseName" className={labelCls}>Course Name</label>
                <input onChange={handleChange} type="text" id="courseName" name="courseName" value={timetable.courseName} placeholder="Enter course name" className={inputCls} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="courseCode" className={labelCls}>Course Code</label>
                <input onChange={handleChange} type="text" id="courseCode" name="courseCode" value={timetable.courseCode} placeholder="Enter course code" className={inputCls} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="teacherName" className={labelCls}>Teacher Name</label>
                <input onChange={handleChange} type="text" id="teacherName" name="teacherName" value={timetable.teacherName} placeholder="Enter teacher name" className={inputCls} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="startTime" className={labelCls}>Start Time</label>
                <input onChange={handleChange} type="time" id="startTime" name="startTime" value={timetable.startTime} className={inputCls} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="endTime" className={labelCls}>End Time</label>
                <input onChange={handleChange} type="time" id="endTime" name="endTime" value={timetable.endTime} className={inputCls} />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button type="submit"
                  className="h-[40px] px-6 flex items-center gap-2 bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow transition-all duration-150">
                  {loading ? "Adding..." : "Add Timetable"}
                </button>
              </div>

            </form>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Degree</label>
              <select value={filters.degreeTitle} onChange={(e) => setFilters({ ...filters, degreeTitle: e.target.value })} className={inputCls}>
                <option value="">All Programs</option>
                <option>BSCS</option><option>BSIT</option><option>BSPHY</option>
                <option>BSCHEM</option><option>BSISL</option><option>BSENG</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Semester</label>
              <select value={filters.semester} onChange={(e) => setFilters({ ...filters, semester: e.target.value })} className={inputCls}>
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Section</label>
              <select value={filters.section} onChange={(e) => setFilters({ ...filters, section: e.target.value })} className={inputCls}>
                <option value="">All Sections</option>
                <option>G1</option><option>G2</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Shift</label>
              <select value={filters.shift} onChange={(e) => setFilters({ ...filters, shift: e.target.value })} className={inputCls}>
                <option value="">All Shifts</option>
                <option>Morning</option><option>Evening</option>
              </select>
            </div>

            <div className="flex gap-2 items-end">
              <button onClick={handleFilter}
                className="flex-1 h-[40px] bg-[#ba7a4e] hover:bg-[#a06840] text-white text-sm font-medium rounded-lg transition">
                {loading2 ? "Filtering..." : "Apply"}
              </button>
              <button onClick={() => { setFilters({ degreeTitle: "", semester: "", shift: "", section: "" }); setFilteredTimetables(timetableList); setCurrentPage(1); }}
                className="flex-1 h-[40px] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] text-gray-700 dark:text-zinc-300 black:text-[#aaa] hover:bg-gray-200 dark:hover:bg-zinc-600 text-sm font-medium rounded-lg transition">
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
                  {["#", "Degree", "Sem", "Section", "Day", "Course Name", "Code", "Teacher", "Start", "End", "Shift", "Actions"].map(h => (
                    <th key={h} className="px-3 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading3 ? (
                  <tr><td colSpan="12" className="text-center py-8 text-[#ba7a4e] text-sm">Loading...</td></tr>
                ) : filteredTimetables.length === 0 ? (
                  <tr><td colSpan="12" className="text-center py-10 text-gray-400 dark:text-zinc-600 black:text-[#333] text-sm">No timetable records found</td></tr>
                ) : currentTimetables.map((item, index) => (
                  <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/30 black:hover:bg-[#141414] transition-colors">
                    <td className="px-3 py-3 text-xs text-gray-400 dark:text-zinc-600 black:text-[#444]">{indexOfFirstTimetable + index + 1}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#ba7a4e] whitespace-nowrap">{item.degreeTitle}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.semester}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.section}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] whitespace-nowrap">{item.day}</td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white whitespace-nowrap">{item.courseName}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#ba7a4e] whitespace-nowrap">{item.courseCode}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] whitespace-nowrap">{item.teacherName}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] whitespace-nowrap">{item.startTime}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] whitespace-nowrap">{item.endTime}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.shift}</td>
                    <td className="px-3 py-3">
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
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
              className="h-8 px-4 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition">
              ← Prev
            </button>
            <span className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#666]">
              Page <span className="font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">{currentPage}</span> of <span className="font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">{totalPages}</span>
            </span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}
              className="h-8 px-4 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa] bg-gray-100 dark:bg-zinc-700 black:bg-[#1a1a1a] rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition">
              Next →
            </button>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default Timetable;