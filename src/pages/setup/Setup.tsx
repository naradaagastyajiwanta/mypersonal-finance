const Setup = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Finance Tracker</h1>
          <p className="mt-2 text-gray-600">
            Setup Required
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Google API Setup Required
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please configure your Google API credentials
              </p>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-800">Steps to setup:</h3>
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>Go to Google Cloud Console</li>
                  <li>Create a new project</li>
                  <li>Enable Google Sheets API & Drive API</li>
                  <li>Create OAuth 2.0 credentials</li>
                  <li>Add Client ID to .env file</li>
                </ol>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium">Environment file:</p>
                <code className="block bg-gray-100 p-2 rounded text-xs mt-1">
                  VITE_GOOGLE_CLIENT_ID=your-client-id-here
                </code>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Reload App
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Check SETUP.md for detailed instructions</p>
        </div>
      </div>
    </div>
  );
};

export default Setup;