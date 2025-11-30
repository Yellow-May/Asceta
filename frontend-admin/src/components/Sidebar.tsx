import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold">ASCETA Admin</h2>
        <p className="text-sm text-gray-400 mt-1">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role}</p>
      </div>
      <nav className="mt-6">
        <Link
          to="/dashboard"
          className={`block px-6 py-3 hover:bg-gray-700 ${
            isActive('/dashboard') ? 'bg-gray-700 border-l-4 border-blue-500' : ''
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/news"
          className={`block px-6 py-3 hover:bg-gray-700 ${
            isActive('/news') ? 'bg-gray-700 border-l-4 border-blue-500' : ''
          }`}
        >
          News
        </Link>
        <Link
          to="/events"
          className={`block px-6 py-3 hover:bg-gray-700 ${
            isActive('/events') ? 'bg-gray-700 border-l-4 border-blue-500' : ''
          }`}
        >
          Events
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/pages"
            className={`block px-6 py-3 hover:bg-gray-700 ${
              isActive('/pages') ? 'bg-gray-700 border-l-4 border-blue-500' : ''
            }`}
          >
            Pages
          </Link>
        )}
        <Link
          to="/profile"
          className={`block px-6 py-3 hover:bg-gray-700 ${
            isActive('/profile') ? 'bg-gray-700 border-l-4 border-blue-500' : ''
          }`}
        >
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

