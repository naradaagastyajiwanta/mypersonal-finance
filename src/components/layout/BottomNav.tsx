import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiList,
  FiBarChart,
  FiSettings
} from 'react-icons/fi';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/transactions', icon: FiList, label: 'Transactions' },
    { path: '/analytics', icon: FiBarChart, label: 'Analytics' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;

            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-3 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;