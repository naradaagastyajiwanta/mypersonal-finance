const Settings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Settings</h2>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Account</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-700">Profile</span>
            <span className="text-gray-400">›</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-700">Privacy</span>
            <span className="text-gray-400">›</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Preferences</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-700">Currency</span>
            <span className="text-gray-600">IDR</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-700">Notifications</span>
            <span className="text-gray-400">›</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Data</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-700">Export Data</span>
            <span className="text-gray-400">›</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-700">Backup</span>
            <span className="text-gray-400">›</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;