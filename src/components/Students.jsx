import React, { useState, useEffect } from "react";
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Footer from "./Footer";

const Students = () => {

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

  const [errors, setErrors] = useState({})

  const validate = () => {
    let newErrors = {};

    if (!studform.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (studform.fullName.length < 2) {
      newErrors.fullName = "Minimum 2 characters required";
    } else if (studform.fullName.length > 50) {
      newErrors.fullName = "Maximum 50 characters allowed";
    }

    if (!studform.collegeRollNo.trim()) {
      newErrors.collegeRollNo = "College roll number is required";
    }

    if (!studform.degreeTitle.trim()) {
      newErrors.degreeTitle = "Please select a program";
    }

    if (!studform.cnic.trim()) {
      newErrors.cnic = "CNIC is required";
    } else if (studform.cnic.length < 15) {
      newErrors.cnic = "Please enter a valid cnic"
    }

    if (!studform.sessionStartDate.trim()) {
      newErrors.sessionStartDate = "Start date is required";
    }

    if (!studform.sessionEndDate.trim()) {
      newErrors.sessionEndDate = "End date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }

  const [studform, setStudform] = useState({
    fullName: "",
    degreeTitle: "",
    collegeRollNo: "",
    cnic: "",
    sessionStartDate: "",
    sessionEndDate: ""
  })

  const [filters, setFilters] = useState({
    studentId: "",
    name: "",
    collegeRollNo: ""
  });

  const [studentDetails, setStudentDetails] = useState({
    fullName: "",
    degreeTitle: "",
    collegeRollNo: "",
    cnic: "",
    address: "",
    registrationNumber: "",
    universityRollNumber: "",
    shift: "",
    section: "",
    semester: "",
    sessionStartDate: "",
    sessionEndDate: "",
    status: "",
    studentId: "",
    stoCount: "",
    Background: "",
    hsscDegree: "",
    hsscMarks: "",
    dob: "",
    email: "",
    phone: "",
    mobile: "",
  })

  const [studentList, setStudentList] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const studentPerPage = 10;

  const [filteredStudents, setFilteredStudents] = useState(studentList);

  const indexOfLastStudent = currentPage * studentPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentPerPage;

  const totalPages = Math.ceil(filteredStudents.length / studentPerPage);

  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  )

  const [menu, setMenu] = useState(false)
  const [loading3, setLoading3] = useState(false)

  const getStudentList = async () => {
    setLoading3(true);
    try {
      const response = await axios.get('/api/v1/admin/students');

      if (response?.data?.success) {
        setStudentList(response.data.data.students);
      } else {
        console.log(response.data.message);
        setStudentList([]);
      }

    } catch (error) {
      console.log(error?.response?.data?.message);
      setStudentList([]);
      setLoading3(false)
    } finally {
      setLoading3(false)
    }
  };

  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnic") {

      let digits = value.replace(/\D/g, "");

      if (digits.length > 5 && digits.length <= 12) {
        digits = digits.slice(0, 5) + "-" + digits.slice(5);
      } else if (digits.length > 12) {
        digits =
          digits.slice(0, 5) +
          "-" +
          digits.slice(5, 12) +
          "-" +
          digits.slice(12, 13);
      }

      setStudform({ ...studform, cnic: digits });
    } else {
      setStudform({ ...studform, [name]: value });
    }
  };

  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnic") {

      let digits = value.replace(/\D/g, "");

      if (digits.length > 5 && digits.length <= 12) {
        digits = digits.slice(0, 5) + "-" + digits.slice(5);
      } else if (digits.length > 12) {
        digits =
          digits.slice(0, 5) +
          "-" +
          digits.slice(5, 12) +
          "-" +
          digits.slice(12, 13);
      }

      setStudentDetails({ ...studentDetails, cnic: digits });
    } else {
      setStudentDetails({ ...studentDetails, [name]: value });
    }


  }

  const handleDelay = (delay) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, delay * 1000);
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await handleDelay(2);
      const response = await axios.post('/api/v1/admin/student/register', studform);
      if (response?.data?.success) {
        await Swal.fire({
          title: response.data.message,
          icon: "success",
          draggable: true,
          theme: isDark ? "dark" : "light"
        });
        setStudform({
          fullName: "",
          degreeTitle: "",
          collegeRollNo: "",
          cnic: "",
          sessionStartDate: "",
          sessionEndDate: ""
        });

        getStudentList();
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
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Remove it!",
        theme: isDark ? "dark" : "light"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(`/api/v1/admin/student/${id}`)
          if (response?.data?.success) {
            await handleDelay(2)
            setStudentList(studentList.filter(item => item._id !== id));
            await Swal.fire({
              title: response?.data?.message,
              icon: "success",
              draggable: true,
              theme: isDark ? "dark" : "light"
            });
          }
        }
      });
    } catch (error) {
      await Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
        draggable: true,
        theme: isDark ? "dark" : "light"
      });
    }
  }

  const handleFetchStudentRecord = (id) => {
    const student = studentList.find(item => item._id === id);
    if (student) {
      setStudentDetails({
        _id: "",
        fullName: "",
        degreeTitle: "",
        collegeRollNo: "",
        cnic: "",
        address: "",
        registrationNumber: "",
        universityRollNumber: "",
        shift: "",
        section: "",
        semester: "",
        sessionStartDate: "",
        sessionEndDate: "",
        status: "",
        studentId: "",
        stoCount: "",
        Background: "",
        hsscDegree: "",
        hsscMarks: "",
        dob: "",
        email: "",
        phone: "",
        mobile: "",
        ...student
      })
    }
  }

  const handleStudentUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading1(true)
      const id = studentDetails?._id;
      const response = await axios.put(`/api/v1/admin/student/${id}`, studentDetails)
      if (response?.data?.success) {
        await handleDelay(4)
        await Swal.fire({
          title: response?.data?.message,
          icon: "success",
          draggable: true,
          theme: isDark ? "dark" : "light"
        });
        setMenu(!menu)
        getStudentList()
      }
    } catch (error) {
      await Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
        draggable: true,
        theme: isDark ? "dark" : "light"
      });
    } finally {
      setLoading1(false)
    }
  }

  const handleFilter = async () => {

    setLoading2(true);
    await handleDelay(2);

    const result = studentList.filter((student) => {
      return (
        student.studentId.toLowerCase().includes(filters.studentId.toLowerCase()) &&
        student.fullName.toLowerCase().includes(filters.name.toLowerCase()) &&
        student.collegeRollNo.toLowerCase().includes(filters.collegeRollNo.toLowerCase())
      );
    });

    setFilteredStudents(result);
    setCurrentPage(1);
    setLoading2(false);
  };

  const totalStudents = studentList.length;

  const activeStudents = studentList.filter(
    (student) => student.status === "Active"
  ).length;

  const bscsStudents = studentList.filter(
    (student) => student.degreeTitle === "BSCS"
  ).length;

  const bsitStudents = studentList.filter(
    (student) => student.degreeTitle === "BSIT"
  ).length;

  const morningShiftStudents = studentList.filter(
    (student) => student.shift === "Morning"
  ).length;

  const eveningShiftStudents = studentList.filter(
    (student) => student.shift === "Evening"
  ).length;

  useEffect(() => {
    getStudentList()
  }, [])

  useEffect(() => {
    setFilteredStudents(studentList);
  }, [studentList]);

  return (
    <>

      <div className={`fixed inset-0 ${menu ? "flex" : "hidden"} justify-center items-center bg-black/60 z-50 `}>
        <div className="bg-white dark:bg-zinc-800 w-[90vw] md:w-[70vw] lg:w-[60vw] max-h-[90vh] flex flex-col rounded-xl shadow-2xl relative p-6 border dark:border-zinc-700">

          <button onClick={() => { setMenu(!menu); }} className="absolute top-3 right-3 text-gray-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 text-xl font-bold">
            ✕
          </button>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 mb-6">📝 Student Record</h2>

          <div className="overflow-y-auto pr-2 flex-1">
            <form onSubmit={handleStudentUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-400">Sto Count</span>
                <input
                  type="text"
                  disabled
                  placeholder={`${studentDetails.stoCount}`}
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-lg bg-gray-100 dark:bg-zinc-700/50 text-gray-400 dark:text-zinc-500 cursor-not-allowed"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-400">Student ID</span>
                <input
                  type="text"
                  disabled
                  placeholder={`${studentDetails.studentId}`}
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-lg bg-gray-100 dark:bg-zinc-700/50 text-gray-400 dark:text-zinc-500 cursor-not-allowed"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Full Name</span>
                <input
                  type="text"
                  onChange={handleStudentFormChange}
                  name="fullName"
                  value={studentDetails.fullName}
                  placeholder="Full Name"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] dark:focus:border-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Program</span>
                <select
                  onChange={handleStudentFormChange}
                  name="degreeTitle"
                  value={studentDetails.degreeTitle}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                >
                  <option value="">Select Program</option>
                  <option>BSCS</option>
                  <option>BSIT</option>
                  <option>BSPHY</option>
                  <option>BSCHEM</option>
                  <option>BSISL</option>
                  <option>BSENG</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Address</span>
                <input
                  onChange={handleStudentFormChange}
                  name="address"
                  value={studentDetails.address}
                  type="text"
                  placeholder="Address"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Registration Number</span>
                <input
                  onChange={handleStudentFormChange}
                  name="registrationNumber"
                  value={studentDetails.registrationNumber}
                  type="text"
                  placeholder="Registration Number"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">University Roll No</span>
                <input
                  onChange={handleStudentFormChange}
                  type="text"
                  name="universityRollNumber"
                  value={studentDetails.universityRollNumber}
                  placeholder="University Roll No"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">College Roll No</span>
                <input
                  onChange={handleStudentFormChange}
                  type="text"
                  name="collegeRollNo"
                  value={studentDetails.collegeRollNo}
                  placeholder="College Roll No"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Shift</span>
                <select
                  onChange={handleStudentFormChange}
                  name="shift"
                  value={studentDetails.shift}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                >
                  <option value="">Select Shift</option>
                  <option>Morning</option>
                  <option>Evening</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Section</span>
                <select
                  onChange={handleStudentFormChange}
                  name="section"
                  value={studentDetails.section}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                >
                  <option value="">Select Section</option>
                  <option>G1</option>
                  <option>G2</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Semester</span>
                <select
                  onChange={handleStudentFormChange}
                  name="semester"
                  value={studentDetails.semester}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
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
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Session Start Date</span>
                <input
                  onChange={handleStudentFormChange}
                  type="date"
                  name="sessionStartDate"
                  value={studentDetails.sessionStartDate}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Session End Date</span>
                <input
                  onChange={handleStudentFormChange}
                  type="date"
                  name="sessionEndDate"
                  value={studentDetails.sessionEndDate}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Status</span>
                <select
                  onChange={handleStudentFormChange}
                  name="status"
                  value={studentDetails.status}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                >
                  <option>Status</option>
                  <option>Active</option>
                  <option>Disabled</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Background</span>
                <select
                  onChange={handleStudentFormChange}
                  name="Background"
                  value={studentDetails.Background}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                >
                  <option value="">Select Background</option>
                  <option>Medical</option>
                  <option>Non-Medical</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">HSSC Degree</span>
                <select
                  onChange={handleStudentFormChange}
                  name="hsscDegree"
                  value={studentDetails.hsscDegree}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                >
                  <option value="">Select HSSC Degree</option>
                  <option>FA</option>
                  <option>ICS</option>
                  <option>Pre-engineering</option>
                  <option>Pre-medical</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">HSSC Marks</span>
                <input
                  onChange={handleStudentFormChange}
                  type="number"
                  name="hsscMarks"
                  value={studentDetails.hsscMarks}
                  placeholder="HSSC Marks"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">CNIC Number</span>
                <input
                  onChange={handleStudentFormChange}
                  type="text"
                  name="cnic"
                  value={studentDetails.cnic}
                  placeholder="CNIC Number"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Date of Birth</span>
                <input
                  onChange={handleStudentFormChange}
                  type="date"
                  name="dob"
                  value={studentDetails.dob}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Email</span>
                <input
                  onChange={handleStudentFormChange}
                  type="email"
                  name="email"
                  value={studentDetails.email}
                  placeholder="Email"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Phone</span>
                <input
                  onChange={handleStudentFormChange}
                  type="text"
                  name="phone"
                  value={studentDetails.phone}
                  placeholder="Phone"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Mobile</span>
                <input
                  onChange={handleStudentFormChange}
                  type="text"
                  name="mobile"
                  value={studentDetails.mobile}
                  placeholder="Mobile"
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] dark:focus:ring-[#ba7a4e] transition"
                />
              </label>

              <button
                type="submit"
                className="col-span-1 md:col-span-2 bg-[#ba7a4e] hover:bg-[#a06840] text-white py-2 rounded-lg shadow transition"
              >
                {loading1 ? "Loading..." : "Update Student"}
              </button>
            </form>
          </div>
        </div>
      </div >

      <div className="p-6 bg-gray-50 dark:bg-zinc-900 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100">Student Management</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Add, view, and manage all registered students in the system.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700">
            <h3 className="text-sm text-gray-500 dark:text-zinc-400">Total Students</h3>
            <p className="text-2xl font-bold text-[#ba7a4e]">{totalStudents}</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700">
            <h3 className="text-sm text-gray-500 dark:text-zinc-400">Active Students</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeStudents}</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700">
            <h3 className="text-sm text-gray-500 dark:text-zinc-400">BSCS Students</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bscsStudents}</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700">
            <h3 className="text-sm text-gray-500 dark:text-zinc-400">BSIT Students</h3>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{bsitStudents}</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700">
            <h3 className="text-sm text-gray-500 dark:text-zinc-400">Morning Shift</h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{morningShiftStudents}</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700">
            <h3 className="text-sm text-gray-500 dark:text-zinc-400">Evening Shift</h3>
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{eveningShiftStudents}</p>
          </div>
        </div>

        {/* Add Student Form */}
        <div className="bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-8 mb-10 border border-gray-100 dark:border-zinc-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
            <span className="text-[#ba7a4e] text-3xl">+</span> Add New Student
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1">
                Full Name
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="fullName"
                name="fullName"
                value={studform.fullName}
                placeholder="Enter full name"
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="collegeRollNo" className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1">
                College Roll No
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="collegeRollNo"
                name="collegeRollNo"
                value={studform.collegeRollNo}
                placeholder="Enter roll number"
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
              {errors.collegeRollNo && <p className="text-red-500 text-sm">{errors.collegeRollNo}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="degreeTitle" className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1">
                Degree Program
              </label>
              <select
                onChange={handleChange}
                id="degreeTitle"
                name="degreeTitle"
                value={studform.degreeTitle}
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
              {errors.degreeTitle && <p className="text-red-500 text-sm">{errors.degreeTitle}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="cnic" className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1">
                CNIC Number
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="cnic"
                name="cnic"
                value={studform.cnic}
                placeholder="XXXXX-XXXXXXX-X"
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
              {errors.cnic && <p className="text-red-500 text-sm">{errors.cnic}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1">
                Session Start Date
              </label>
              <input
                onChange={handleChange}
                type="date"
                id="sessionStartDate"
                name="sessionStartDate"
                value={studform.sessionStartDate}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
              {errors.sessionStartDate && <p className="text-red-500 text-sm">{errors.sessionStartDate}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1">
                Session End Date
              </label>
              <input
                onChange={handleChange}
                type="date"
                id="sessionEndDate"
                name="sessionEndDate"
                value={studform.sessionEndDate}
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
              {errors.sessionEndDate && <p className="text-red-500 text-sm">{errors.sessionEndDate}</p>}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#ba7a4e] hover:bg-[#a06840] text-white font-medium px-6 py-2.5 rounded-lg shadow transition duration-200"
              >
                {loading ? "Loading..." : "Add Student"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-4 mb-6 border border-gray-100 dark:border-zinc-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
              type="text"
              value={filters.studentId}
              onChange={(e) =>
                setFilters({ ...filters, studentId: e.target.value })
              }
              placeholder="Student ID"
              className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
            />

            <input
              type="text"
              value={filters.name}
              onChange={(e) =>
                setFilters({ ...filters, name: e.target.value })
              }
              placeholder="Name"
              className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
            />

            <input
              type="text"
              value={filters.collegeRollNo}
              onChange={(e) =>
                setFilters({ ...filters, collegeRollNo: e.target.value })
              }
              placeholder="College Roll No"
              className="px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]"
            />

            <div className="flex gap-2">

              <button
                onClick={handleFilter}
                className="flex-1 bg-[#ba7a4e] hover:bg-[#a86a3f] text-white font-medium rounded-lg px-4 py-3 transition"
              >
                {loading2 ? "Filtering..." : "Apply"}
              </button>

              <button
                onClick={() => {
                  setFilters({ studentId: "", name: "", collegeRollNo: "" });
                  setFilteredStudents(studentList);
                  setCurrentPage(1);
                }}
                className="flex-1 bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-500 font-medium rounded-lg px-4 py-3 transition"
              >
                Reset
              </button>

            </div>

          </div>

        </div>

        {/* Student Table */}
        <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl overflow-x-auto border border-gray-100 dark:border-zinc-700">
          <div className="w-full overflow-x-auto">

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-zinc-700/60 text-gray-700 dark:text-zinc-300 text-sm uppercase tracking-wide">
                  <th className="p-3">#</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">CRN</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Student-Id</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading3 ? <tr>
                  <td colSpan="7" className="text-center p-6 text-[#ba7a4e]">Loading...</td>
                </tr> : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-400 dark:text-zinc-500">No Student Record</td>
                  </tr>
                ) : currentStudents.map((item, index) => (
                  <tr key={index} className="border-t border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/40 text-gray-800 dark:text-zinc-200 transition-colors">
                    <td className="p-3 text-gray-400 dark:text-zinc-500">{indexOfFirstStudent + index + 1}</td>
                    <td className="p-3 font-medium">{item.fullName}</td>
                    <td className="p-3">{item.collegeRollNo}</td>
                    <td className="p-3">{item.degreeTitle}</td>
                    <td className="p-3 font-semibold text-[#ba7a4e]">{item.studentId}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${item.status === "Active"
                        ? "bg-green-100 dark:bg-green-400/10 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-400/10 text-red-600 dark:text-red-400"
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 flex md:flex-row flex-col md:gap-x-2 gap-y-2">
                      <button
                        onClick={() => { handleFetchStudentRecord(item._id); setMenu(!menu); }}
                        className="px-3 py-1 text-sm bg-[#ba7a4e] hover:bg-[#a06840] text-white rounded-lg shadow transition"
                      >
                        <FaEye size={18} />
                      </button>
                      <button
                        onClick={() => { handleDelete(item._id) }}
                        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 text-white rounded-lg transition"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
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
      </div>

      <Footer />

    </>
  );
};

export default Students;



