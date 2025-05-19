import { useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-3xl font-semibold mb-6 border-b pb-2">⚙️ Settings</h1>

      <div className="space-y-6">

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Dark Mode</h2>
            <p className="text-sm text-gray-500">Toggle dark/light appearance</p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-400 transition-all duration-300"></div>
          </label>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Notifications</h2>
            <p className="text-sm text-gray-500">Enable daily reminders</p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-400 transition-all duration-300"></div>
          </label>
        </div>

        {/* Change Password */}
        <div>
          <h2 className="text-lg font-medium mb-2">Change Password</h2>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-md"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-2">This action is irreversible.</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}
