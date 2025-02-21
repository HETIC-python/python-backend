import { Link, useNavigate } from 'react-router';
import { useUser } from '../context/user';
import { useState } from 'react';
import { isUserAdmin } from '../utils/user';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUser();
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              CarMarket
            </Link>
            <div className="ml-10 space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Cars
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                Contact
              </Link>
              <Link to="/appointments" className="text-gray-600 hover:text-blue-600">
                Appointments
              </Link>
              {isAuthenticated && isUserAdmin() && (
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Admin
                  </button>
                  
                  {isAdminDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to="/admin/cars"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Cars
                        </Link>
                        <Link
                          to="/admin/services"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Services
                        </Link>
                        <Link
                          to="/admin/appointments"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Appointments
                        </Link>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/user/profile" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstname || 'User'}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user?.firstname || 'Profile'}</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/user/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
