import React from "react";

const Settings = () => {
  return (
    <div className="p-6">

      {/* Header */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account preferences and app configurations.
        </p>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-10 text-center">

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Settings Coming Soon...
        </h2>

        <p className="text-gray-500 max-w-md mx-auto">
          This section will soon allow you to update your profile, 
          security settings, notifications, and more.
        </p>

        <p className="mt-6 text-sm text-gray-600">
          Stay tuned!
        </p>

      </div>

    </div>
  );
};

export default Settings;
