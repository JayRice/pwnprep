import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Lock, Menu, X, Moon, Sun, UserCircle, LogIn, Settings, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import SearchBar from './SearchBar';
import LoginModal from './LoginModal';
import {

  signOut,

} from '../database/firebase.ts'


interface NavProps {
  user: user | null
  setUser: () => void
  premium: boolean
}

export default function Navbar({ user, setUser, premium  }: NavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);



  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {



    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = useNavigate();

  return (
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Terminal className="h-8 w-8 text-purple-600" />
                <span className="font-bold text-xl text-gray-900">PwnPrep</span>
              </Link>
            </div>

            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar onSelect={(path) => navigate(path)} />
            </div>

            <div className="hidden md:flex items-center space-x-4">
                  <Link
                  to="/premium"
                  className="flex items-center space-x-1 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                {!premium && <Lock className="h-4 w-4" />}
                <span>{premium ? 'Premium Active' : 'Premium'}</span>
              </Link>
              {user != null ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <UserCircle className="h-6 w-6" />
                    </button>
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          <Link
                              to="/profile"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>

                          <hr className="my-1" />
                          <button
                              onClick={() => {
                                // Add logout logic here
                                signOut();
                                navigate('/');
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </div>
                    )}
                  </div>
              ) : (
                  <button
                      onClick={() => {
                        console.log('Profile clicked. User = ', user);
                        setIsLoginModalOpen(true);
                      }}
                      className="flex items-center space-x-1 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </button>
              )}
            </div>

            <div className="md:hidden">
              <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700"
              >
                {isMenuOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="px-4 py-2">
                  <SearchBar onSelect={(path) => {
                    navigate(path);
                    setIsMenuOpen(false);
                  }} />
                </div>
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  {isDarkMode ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <Link
                    to="/premium"
                    className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Lock className="h-4 w-4" />
                  <span>{premium ? 'Premium Active' : 'Premium'}</span>
                </Link>
                {user != null ? (
                    <button
                        onClick={() => console.log('Profile clicked')}
                        className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <UserCircle className="h-5 w-5 mr-2" />
                      <span>Profile</span>
                    </button>
                ) : (
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      <span>Login</span>
                    </button>
                )}
              </div>
            </div>
        )}

        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            setUser={setUser}
        />
      </nav>
  );
}