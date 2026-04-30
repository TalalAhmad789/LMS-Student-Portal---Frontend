import React from "react";

const Applications = () => {
  const recentApplications = [
    {
      title: "Bonafide Certificate",
      date: "2 Apr 2026",
      status: "Approved",
    },
    {
      title: "Leave Request",
      date: "4 Apr 2026",
      status: "Pending",
    },
    {
      title: "Duplicate ID Card",
      date: "5 Apr 2026",
      status: "Rejected",
    },
  ];

  const services = [
    "🎓 Bonafide Certificate",
    "🪪 ID Card Request",
    "📑 Leave Request",
    "📄 Transcript Request",
    "💸 Fee Challan",
    "🚌 Transport Request",
  ];

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📄 Applications</h1>
        <p className="text-gray-500 mt-1">
          Submit and track your academic applications easily.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-400">
          <h3 className="text-sm text-gray-500">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">3</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-sm text-gray-500">Approved</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">8</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">
          <h3 className="text-sm text-gray-500">Rejected</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">1</p>
        </div>
      </div>

      {/* Quick Apply */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🚀 Quick Apply
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer border border-gray-100"
            >
              <h3 className="font-semibold text-gray-800">{item}</h3>
              <p className="text-sm text-gray-500 mt-2">
                Submit request online in a few clicks.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🕒 Recent Applications
        </h2>

        <div className="space-y-4">
          {recentApplications.map((app, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <h3 className="font-medium text-gray-800">{app.title}</h3>
                <p className="text-sm text-gray-500">{app.date}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  app.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : app.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;