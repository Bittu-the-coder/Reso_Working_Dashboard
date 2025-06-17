import React from "react";

const Settings: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
      <h3 className="text-lg font-medium text-white mb-4">
        Dashboard Settings
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-white mb-2">
            General Settings
          </h4>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="dark-mode"
                name="dark-mode"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="dark-mode"
                className="ml-2 block text-sm text-white/80"
              >
                Dark Mode
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="notifications"
                name="notifications"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                defaultChecked
              />
              <label
                htmlFor="notifications"
                className="ml-2 block text-sm text-white/80"
              >
                Email Notifications
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-white text-indigo-900 hover:bg-white/90 transition-colors py-3 px-6 rounded-lg font-semibold shadow-md">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
