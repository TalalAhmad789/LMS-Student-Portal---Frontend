import React from "react";

const Assignments = () => {
  return (
    <div className="p-6">

      {/* Header */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Assignments
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View your upcoming and submitted assignments here.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-10 text-center">

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Assignments Coming Soon...
        </h2>

        <p className="text-gray-500 max-w-md mx-auto">
          Your instructors are preparing your assignment materials.  
          They will appear here once available.
        </p>

        <div className="mt-6 text-sm text-gray-600">
          Stay tuned for updates.
        </div>
      </div>

    </div>
  );
};

export default Assignments;
