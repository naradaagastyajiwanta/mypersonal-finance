import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const { signIn, isLoading } = useAuth();

  const handleSignIn = async () => {
    try {
      console.log('Attempting to sign in...');
      await signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed. Please check the console for details.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Finance Tracker</h1>
          <p className="mt-2 text-gray-600">
            Kelola keuangan pribadi Anda dengan mudah
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Masuk untuk Melanjutkan
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Data Anda akan tersimpan aman di Google Sheets
              </p>
            </div>

            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              Masuk dengan Google
            </button>

            <div className="text-xs text-gray-500 text-center">
              <p>Dengan masuk, Anda setuju untuk memberikan akses ke:</p>
              <ul className="mt-2 space-y-1">
                <li>• Google Sheets (untuk menyimpan data keuangan)</li>
                <li>• Google Drive (untuk membuat file spreadsheet)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Data Anda tersimpan di Google Sheets milik Anda sendiri</p>
          <p>Aplikasi ini tidak menyimpan data di server kami</p>
        </div>
      </div>
    </div>
  );
};

export default Login;