import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/auth';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Handle user logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Toggle profile dropdown
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo & Brand */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Update Life
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          {currentUser && (
            <>
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md ${
                  isActive('/dashboard')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('nav.dashboard')}
              </Link>
              
              <Link
                to="/tasks"
                className={`px-3 py-2 rounded-md ${
                  isActive('/tasks')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('nav.tasks')}
              </Link>
              
              <Link
                to="/stats"
                className={`px-3 py-2 rounded-md ${
                  isActive('/stats')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('nav.stats')}
              </Link>
            </>
          )}
          
          {!currentUser && (
            <>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md ${
                  isActive('/about')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('nav.about')}
              </Link>
              
              <Link
                to="/features"
                className={`px-3 py-2 rounded-md ${
                  isActive('/features')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('nav.features')}
              </Link>
            </>
          )}
        </div>
        
        {/* Right Side Menu (Auth & Language) */}
        <div className="flex items-center">
          <LanguageSelector />
          
          {currentUser ? (
            <div className="relative ml-3">
              <button
                onClick={toggleProfile}
                className="flex items-center text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="user-menu"
                aria-haspopup="true"
              >
                <span className="sr-only">{t('header.openUserMenu')}</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>
              
              {/* Profile dropdown */}
              {isProfileOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-20"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    {currentUser.displayName || currentUser.email}
                  </div>
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('header.profile')}
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('header.settings')}
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {t('header.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2 ml-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded border border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                {t('auth.signIn')}
              </Link>
              
              <Link
                to="/register"
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                {t('auth.signUp')}
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden ml-2">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
            >
              <span className="sr-only">{isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}</span>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/dashboard')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMenu}
              >
                {t('nav.dashboard')}
              </Link>
              
              <Link
                to="/tasks"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/tasks')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMenu}
              >
                {t('nav.tasks')}
              </Link>
              
              <Link
                to="/stats"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/stats')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMenu}
              >
                {t('nav.stats')}
              </Link>
              
              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/profile')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMenu}
              >
                {t('header.profile')}
              </Link>
              
              <Link
                to="/settings"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/settings')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMenu}
              >
                {t('header.settings')}
              </Link>
              
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {t('header.signOut')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/about"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/about')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMenu}
              >
                {t('nav.about')}
              </Link>
              
              <Link
                to="/features"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/features')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMenu}
              >
                {t('nav.features')}
              </Link>
              
              <Link
                to="/login"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/login')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMenu}
              >
                {t('auth.signIn')}
              </Link>
              
              <Link
                to="/register"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/register')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMenu}
              >
                {t('auth.signUp')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
