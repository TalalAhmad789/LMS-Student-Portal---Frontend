import React, { useState, useEffect } from "react";
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaEye } from "react-icons/fa";
import { MdDelete, MdLockReset } from "react-icons/md";
import Footer from "./Footer";
import { PiStudentFill } from "react-icons/pi";

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

  const handleResetPassword = async (id) => {
    try {
      Swal.fire({
        title: "Do you want to reset the password?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Reset",
        denyButtonText: `Don't reset`,
        theme: isDark ? "dark" : "light"
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleDelay(2)
          const response = await axios.post("/api/v1/admin/student/reset-password", { id: id }, { withCredentials: true });
          if (response?.data?.success) {
            await Swal.fire({
              title: "Reset!",
              icon: "success",
              theme: isDark ? "dark" : "light"
            });
          }
        }
        else if (result.isDenied) {
          await Swal.fire({
            title: "Password are not reset!",
            icon: "info",
            theme: isDark ? "dark" : "light"
          });
        }
      });
    } catch (error) {
      await Swal.fire({
        title: error.response.data.message,
        icon: "error",
        draggable: true,
        theme: isDark ? "dark" : "light"
      });
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
    (student) => student.degreeTitle === "CS"
  ).length;

  const bsitStudents = studentList.filter(
    (student) => student.degreeTitle === "IT"
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
      < div className={`fixed inset-0 ${menu ? "flex" : "hidden"} justify-center items-center bg-black/50 backdrop-blur-sm z-50 px-4`
      }>
        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] w-full md:w-[75vw] lg:w-[62vw] max-h-[90vh] flex flex-col rounded-2xl shadow-2xl relative border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] overflow-hidden">

          <div className="h-[3px] bg-[#ba7a4e] flex-shrink-0" />

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e]">
                <PiStudentFill size={18} />
              </span>
              <h2 className="text-base font-medium text-gray-800 dark:text-zinc-100 black:text-white">
                Edit Student Record
              </h2>
            </div>
            <button
              onClick={() => setMenu(!menu)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-5">
            <form onSubmit={handleStudentUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {[
                { label: "STO Count", value: studentDetails.stoCount },
                { label: "Student ID", value: studentDetails.studentId },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">{label}</span>
                  <input
                    type="text"
                    disabled
                    placeholder={`${value}`}
                    className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-700 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700/30 black:bg-[#141414] text-gray-400 dark:text-zinc-600 cursor-not-allowed"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Full Name</span>
                <input type="text" onChange={handleStudentFormChange} name="fullName" value={studentDetails.fullName} placeholder="Full Name"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Program</span>
                <select onChange={handleStudentFormChange} name="degreeTitle" value={studentDetails.degreeTitle}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                  <option value="">Select Program</option>
                  <option>CS</option><option>IT</option><option>PHY</option><option>CHEM</option><option>ISL</option><option>ENG</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Address</span>
                <input onChange={handleStudentFormChange} name="address" value={studentDetails.address} type="text" placeholder="Address"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Registration Number</span>
                <input onChange={handleStudentFormChange} name="registrationNumber" value={studentDetails.registrationNumber} type="text" placeholder="Registration Number"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">University Roll No</span>
                <input onChange={handleStudentFormChange} type="text" name="universityRollNumber" value={studentDetails.universityRollNumber} placeholder="University Roll No"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">College Roll No</span>
                <input onChange={handleStudentFormChange} type="text" name="collegeRollNo" value={studentDetails.collegeRollNo} placeholder="College Roll No"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Shift</span>
                <select onChange={handleStudentFormChange} name="shift" value={studentDetails.shift}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                  <option value="">Select Shift</option>
                  <option>Morning</option><option>Evening</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Section</span>
                <select onChange={handleStudentFormChange} name="section" value={studentDetails.section}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                  <option value="">Select Section</option>
                  <option>G1</option><option>G2</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Semester</span>
                <select onChange={handleStudentFormChange} name="semester" value={studentDetails.semester}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Session Start Date</span>
                <input onChange={handleStudentFormChange} type="date" name="sessionStartDate" value={studentDetails.sessionStartDate}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Session End Date</span>
                <input onChange={handleStudentFormChange} type="date" name="sessionEndDate" value={studentDetails.sessionEndDate}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Status</span>
                <select onChange={handleStudentFormChange} name="status" value={studentDetails.status}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                  <option>Status</option><option>Active</option><option>Disabled</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Background</span>
                <select onChange={handleStudentFormChange} name="Background" value={studentDetails.Background}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                  <option value="">Select Background</option>
                  <option>Medical</option><option>Non-Medical</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">HSSC Degree</span>
                <select onChange={handleStudentFormChange} name="hsscDegree" value={studentDetails.hsscDegree}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                  <option value="">Select HSSC Degree</option>
                  <option>FA</option><option>ICS</option><option>Pre-engineering</option><option>Pre-medical</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">HSSC Marks</span>
                <input onChange={handleStudentFormChange} type="number" name="hsscMarks" value={studentDetails.hsscMarks} placeholder="HSSC Marks"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">CNIC Number</span>
                <input onChange={handleStudentFormChange} type="text" name="cnic" value={studentDetails.cnic} placeholder="CNIC Number"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Date of Birth</span>
                <input onChange={handleStudentFormChange} type="date" name="dob" value={studentDetails.dob}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Email</span>
                <input onChange={handleStudentFormChange} type="email" name="email" value={studentDetails.email} placeholder="Email"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Phone</span>
                <input onChange={handleStudentFormChange} type="text" name="phone" value={studentDetails.phone} placeholder="Phone"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Mobile</span>
                <input onChange={handleStudentFormChange} type="text" name="mobile" value={studentDetails.mobile} placeholder="Mobile"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
              </div>

              <button type="submit"
                className="col-span-1 sm:col-span-2 h-[42px] flex items-center justify-center gap-2 bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow transition-all duration-150 mt-2">
                {loading1 ? "Saving..." : "Update Student"}
              </button>
            </form>
          </div>
        </div>
      </div >

      < div className="w-full h-[3px] bg-[#ba7a4e]" />
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 black:bg-[#0a0a0a] min-h-screen">

        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-[#ba7a4e]/10 border border-[#ba7a4e]/20 flex items-center justify-center text-[#ba7a4e] flex-shrink-0">
            <PiStudentFill size={22} />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white">Student Management</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#888]">
              Add, view, and manage all registered students in the system.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Total", value: totalStudents, color: "text-[#ba7a4e]" },
            { label: "Active", value: activeStudents, color: "text-green-600 dark:text-green-400" },
            { label: "BSCS", value: bscsStudents, color: "text-blue-600 dark:text-blue-400" },
            { label: "BSIT", value: bsitStudents, color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Morning", value: morningShiftStudents, color: "text-yellow-600 dark:text-yellow-400" },
            { label: "Evening", value: eveningShiftStudents, color: "text-pink-600 dark:text-pink-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl p-3 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm">
              <p className="text-xs text-gray-500 dark:text-zinc-400 black:text-[#666] mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm overflow-hidden mb-5">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
            <span className="w-7 h-7 rounded-lg bg-[#ba7a4e]/10 flex items-center justify-center text-[#ba7a4e] text-lg font-bold leading-none">+</span>
            <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white">Add New Student</h2>
          </div>
          <div className="p-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Full Name</label>
                <input onChange={handleChange} type="text" id="fullName" name="fullName" value={studform.fullName} placeholder="Enter full name"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="collegeRollNo" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">College Roll No</label>
                <input onChange={handleChange} type="text" id="collegeRollNo" name="collegeRollNo" value={studform.collegeRollNo} placeholder="Enter roll number"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
                {errors.collegeRollNo && <p className="text-red-500 text-xs">{errors.collegeRollNo}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="degreeTitle" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Degree Program</label>
                <select onChange={handleChange} id="degreeTitle" name="degreeTitle" value={studform.degreeTitle}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition">
                  <option value="">Select Program</option>
                  <option>CS</option><option>IT</option><option>PHY</option><option>CHEM</option><option>ISL</option><option>ENG</option>
                </select>
                {errors.degreeTitle && <p className="text-red-500 text-xs">{errors.degreeTitle}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="cnic" className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">CNIC Number</label>
                <input onChange={handleChange} type="text" id="cnic" name="cnic" value={studform.cnic} placeholder="XXXXX-XXXXXXX-X"
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
                {errors.cnic && <p className="text-red-500 text-xs">{errors.cnic}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Session Start Date</label>
                <input onChange={handleChange} type="date" id="sessionStartDate" name="sessionStartDate" value={studform.sessionStartDate}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
                {errors.sessionStartDate && <p className="text-red-500 text-xs">{errors.sessionStartDate}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444]">Session End Date</label>
                <input onChange={handleChange} type="date" id="sessionEndDate" name="sessionEndDate" value={studform.sessionEndDate}
                  className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
                {errors.sessionEndDate && <p className="text-red-500 text-xs">{errors.sessionEndDate}</p>}
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button type="submit"
                  className="h-[40px] px-6 flex items-center gap-2 bg-[#ba7a4e] hover:bg-[#a06840] active:scale-[0.98] text-white text-sm font-medium rounded-lg shadow transition-all duration-150">
                  {loading ? "Adding..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f] shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input type="text" value={filters.studentId} onChange={(e) => setFilters({ ...filters, studentId: e.target.value })} placeholder="Student ID"
              className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
            <input type="text" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} placeholder="Name"
              className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
            <input type="text" value={filters.collegeRollNo} onChange={(e) => setFilters({ ...filters, collegeRollNo: e.target.value })} placeholder="College Roll No"
              className="h-[40px] px-3 text-sm border border-gray-200 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-gray-50 dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#ba7a4e]/20 focus:border-[#ba7a4e] transition" />
            <div className="flex gap-2">
              <button onClick={handleFilter}
                className="flex-1 h-[40px] bg-[#ba7a4e] hover:bg-[#a06840] text-white text-sm font-medium rounded-lg transition">
                {loading2 ? "Filtering..." : "Apply"}
              </button>
              <button onClick={() => { setFilters({ studentId: "", name: "", collegeRollNo: "" }); setFilteredStudents(studentList); setCurrentPage(1); }}
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
                  {["#", "Name", "CRN", "Class", "Student ID", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 black:text-[#444] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading3 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-[#ba7a4e] text-sm">Loading...</td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400 dark:text-zinc-600 black:text-[#333] text-sm">No student records found</td>
                  </tr>
                ) : currentStudents.map((item, index) => (
                  <tr key={index} className="border-t border-gray-50 dark:border-zinc-700/50 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/30 black:hover:bg-[#141414] transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-600 black:text-[#444]">{indexOfFirstStudent + index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-100 black:text-white whitespace-nowrap">{item.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.collegeRollNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400 black:text-[#aaa]">{item.degreeTitle}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#ba7a4e]">{item.studentId}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${item.status === "Active"
                        ? "bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-400/10 text-red-600 dark:text-red-400"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { handleFetchStudentRecord(item._id); setMenu(!menu); }}
                          className="w-8 h-8 flex items-center justify-center bg-[#ba7a4e] hover:bg-[#a06840] text-white rounded-lg shadow-sm transition"
                          title="View / Edit">
                          <FaEye size={14} />
                        </button>
                        <button onClick={() => handleResetPassword(item._id)}
                          className="w-8 h-8 flex items-center justify-center bg-[#ba7a4e]/10 hover:bg-[#ba7a4e]/20 text-[#ba7a4e] border border-[#ba7a4e]/20 rounded-lg transition"
                          title="Reset Password">
                          <MdLockReset size={16} />
                        </button>
                        <button onClick={() => handleDelete(item._id)}
                          className="w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-lg transition"
                          title="Delete">
                          <MdDelete size={16} />
                        </button>
                      </div>
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

export default Students;



