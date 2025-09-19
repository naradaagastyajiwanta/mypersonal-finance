import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Finance Tracker</h1>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FiUser className="w-6 h-6 text-gray-600" />
            )}
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-3 border-b border-gray-200">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showProfile && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowProfile(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;