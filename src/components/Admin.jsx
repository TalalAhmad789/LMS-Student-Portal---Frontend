import React, { useState, useEffect } from "react";
import axios from 'axios'
import Swal from 'sweetalert2'

const Admin = () => {

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
  
  const [adminform, setAdminform] = useState({
    fullName: "",
    email: "",
    cnic: "",
  })

  const [searchTerm, setSearchTerm] = useState("")

  const [adminDetails, setAdminDetails] = useState({
    fullName: "",
    cnic: "",
    email: "",
    status: "",
    isSuperAdmin: false
  })

  const [adminList, setAdminList] = useState([])

  const [menu, setMenu] = useState(false)

  const getAdminList = async () => {
    try {
      const response = await axios.get('/api/v1/admin/admins');
      if (response?.data?.success) {
        console.log(response?.data?.data?.admins)
        setAdminList(response?.data?.data?.admins)
      }
    } catch (error) {
      console.log(error?.response?.data?.message)
    }
  }

  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminform({ ...adminform, [name]: value })
  }

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails({ ...adminDetails, [name]: value });
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
    try {
      setLoading(true)
      await handleDelay(4)

      const response = await axios.post('/api/v1/admin/admin/register', adminform);
      if (response?.data?.success) {
        await Swal.fire({
          title: response?.data?.message,
          icon: "success",
          draggable: true,
          theme: isDark ? "dark" : "light"
        });
        setAdminform({
          fullName: "",
          email: "",
          cnic: ""
        })
        getAdminList()
      }
    } catch (error) {
      await Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
        draggable: true,
        theme: isDark ? "dark" : "light"
      });
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

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
          const response = await axios.delete(`/api/v1/admin/admin/${id}`);
          if (response?.data?.success) {
            await handleDelay(2)
            setAdminList(adminList.filter(item => item._id !== id));
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
      await handleDelay(2)
      await Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
        draggable: true,
        theme: isDark ? "dark" : "light"
      });
    }
  }

  const handleFetchAdminRecord = (id) => {
    const admin = adminList.find(item => item._id === id);
    if (admin) {
      setAdminDetails({
        _id: "",
        fullName: "",
        cnic: "",
        email: "",
        status: "",
        isSuperAdmin: false,
        ...admin
      })
    }
  }

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading1(true)
      const id = adminDetails?._id;
      const response = await axios.put(`/api/v1/admin/admin/${id}`, adminDetails);
      if (response?.data?.success) {
        await handleDelay(4)
        setMenu(!menu);
        getAdminList()
        await Swal.fire({
          title: response?.data?.message,
          icon: "success",
          draggable: true,
          theme: isDark ? "dark" : "light"
        });
      }
    } catch (error) {
      setLoading1(false)
      await Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
        draggable: true,
        theme: isDark ? "dark" : "light"
      });
      setMenu(!menu)
    } finally {
      setLoading1(false)
    }
  }

  const filteredAdmins = adminList.filter(admin => {
    const term = searchTerm.toLowerCase();

    return (
      admin.fullName?.toLowerCase().includes(term) ||
      admin.email?.toLowerCase().includes(term)
    )
  });

  const totalAdmins = adminList.length;

  const activeAdmins = adminList.filter(
    (admin) => admin.status === "Active"
  ).length;

  useEffect(() => {
    getAdminList()
  }, [])

  return (
    <>
      <div className={`fixed inset-0 ${menu ? "flex" : "hidden"} justify-center items-center bg-black/60 z-50`}>
        <div className="bg-white dark:bg-zinc-800 black:bg-black w-[90vw] md:w-[70vw] lg:w-[60vw] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative p-6 border border-transparent dark:border-zinc-700 black:border-[#2a2a2a]">

          <button onClick={() => { setMenu(!menu); }} className="absolute top-3 right-3 text-gray-500 dark:text-zinc-400 black:text-[#666] hover:text-red-500 dark:hover:text-red-400 black:hover:text-red-500 text-xl font-bold">
            ✕
          </button>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white mb-6">📝 Admin Record</h2>

          <form onSubmit={handleAdminUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">Full Name</span>
              <input
                type="text"
                onChange={handleAdminFormChange}
                name="fullName"
                value={adminDetails.fullName}
                placeholder="Full Name"
                className="px-4 py-2 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] transition"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">Email</span>
              <input
                onChange={handleAdminFormChange}
                type="email"
                name="email"
                value={adminDetails.email}
                placeholder="Email"
                className="px-4 py-2 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] transition"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">Status</span>
              <select
                onChange={handleAdminFormChange}
                name="status"
                value={adminDetails.status}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] transition"
              >
                <option>Status</option>
                <option>Active</option>
                <option>Disabled</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 black:text-[#aaa]">CNIC Number</span>
              <input
                onChange={handleAdminFormChange}
                type="text"
                name="cnic"
                value={adminDetails.cnic}
                placeholder="CNIC Number"
                className="px-4 py-2 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] transition"
              />
            </label>

            <button
              type="submit"
              className="col-span-1 md:col-span-2 bg-[#ba7a4e] hover:bg-[#a06840] text-white py-2 rounded-lg shadow transition"
            >
              {loading1 ? "Loading..." : "Update Admin"}
            </button>
          </form>
        </div>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-zinc-900 black:bg-black min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 black:text-white">👩‍🎓 Admin Management</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">
            Add, view, and manage all registered admins in the system.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
            <h3 className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">Total Admins</h3>
            <p className="text-2xl font-bold text-[#ba7a4e]">{totalAdmins}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] rounded-xl shadow p-4 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
            <h3 className="text-sm text-gray-500 dark:text-zinc-400 black:text-[#555]">Active Admins</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 black:text-green-500">{activeAdmins}</p>
          </div>
        </div>

        {/* Add Admin Form */}
        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-xl rounded-2xl p-8 mb-10 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 black:text-white mb-6 flex items-center gap-2">
            <span className="text-[#ba7a4e] text-3xl">+</span> Add New Admin
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                Full Name
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="fullName"
                name="fullName"
                value={adminform.fullName}
                placeholder="Enter full name"
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                Email Address
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="email"
                name="email"
                value={adminform.email}
                placeholder="Enter email address"
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="cnic" className="text-sm font-medium text-gray-600 dark:text-zinc-400 black:text-[#777] mb-1">
                CNIC Number
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="cnic"
                name="cnic"
                value={adminform.cnic}
                placeholder="XXXXX-XXXXXXX-X"
                className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#ba7a4e] hover:bg-[#a06840] text-white font-medium px-6 py-2.5 rounded-lg shadow transition duration-200"
              >
                {loading ? "Loading..." : "Add Admin"}
              </button>
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-md rounded-xl p-4 mb-6 border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value) }}
            placeholder="🔍 Search by Email or Name..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 black:border-[#2a2a2a] rounded-lg bg-white dark:bg-zinc-700 black:bg-[#141414] text-gray-800 dark:text-zinc-100 black:text-[#e5e5e5] placeholder-gray-400 dark:placeholder-zinc-500 black:placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#ba7a4e] focus:border-[#ba7a4e] transition"
          />
        </div>

        {/* Admin Table */}
        <div className="bg-white dark:bg-zinc-800 black:bg-[#0d0d0d] shadow-md rounded-xl overflow-x-auto border border-gray-100 dark:border-zinc-700 black:border-[#1f1f1f]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-zinc-700/60 black:bg-[#141414] text-gray-700 dark:text-zinc-300 black:text-[#555] text-sm uppercase tracking-wide">
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Cnic</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400 dark:text-zinc-500 black:text-[#333]">No Admin Record</td>
                </tr>
              ) : filteredAdmins.map((item, index) => (
                <tr key={index} className="border-t border-gray-100 dark:border-zinc-700 black:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-zinc-700/40 black:hover:bg-[#141414] text-gray-800 dark:text-zinc-200 black:text-[#ccc] transition-colors">
                  <td className="p-3 text-gray-400 dark:text-zinc-500 black:text-[#3a3a3a]">{index + 1}</td>
                  <td className="p-3 font-medium">{item.fullName}</td>
                  <td className="p-3 font-semibold text-[#ba7a4e]">{item.email}</td>
                  <td className="p-3">{item.cnic}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${item.status === "Active"
                      ? "bg-green-100 dark:bg-green-400/10 black:bg-green-500/10 text-green-700 dark:text-green-400 black:text-green-500"
                      : "bg-red-100 dark:bg-red-400/10 black:bg-red-500/10 text-red-600 dark:text-red-400 black:text-red-500"
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => { handleFetchAdminRecord(item._id); setMenu(!menu); }}
                      className="px-3 py-1 text-sm bg-[#ba7a4e] hover:bg-[#a06840] text-white rounded-lg shadow transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => { handleDelete(item._id) }}
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 black:bg-red-500/10 black:hover:bg-red-500/20 black:text-red-500 text-white rounded-lg transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Admin
