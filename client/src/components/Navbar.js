import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBriefcase, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, isEmployer, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaBriefcase className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold text-blue-600">JobBoard</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Find Jobs
            </Link>

            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Sign Up
                </Link>
              </>
            )}

            {isAuthenticated && isEmployer && (
              <>
                <Link to="/employer/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/employer/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Post a Job
                </Link>
              </>
            )}

            {isAuthenticated && !isEmployer && (
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                My Applications
              </Link>
            )}

            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <FaUser />
                  <span className="font-medium">{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 text-xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col space-y-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
              Find Jobs
            </Link>

            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}

            {isAuthenticated && isEmployer && (
              <>
                <Link to="/employer/dashboard" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/employer/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setMenuOpen(false)}>
                  Post a Job
                </Link>
              </>
            )}

            {isAuthenticated && !isEmployer && (
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
                My Applications
              </Link>
            )}

            {isAuthenticated && (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Profile ({user?.name})
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium text-left">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;