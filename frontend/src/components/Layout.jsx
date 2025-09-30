import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  PlusIcon,
  HomeIcon,
  UserIcon,
  HeartIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon },
    ...(isAuthenticated ? [
      { name: 'My Projects', href: '/my-projects', icon: UserIcon },
      { name: 'Favorites', href: '/favorites', icon: HeartIcon },
    ] : [])
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen page-bg">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
             onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full sidebar-bg transform transition ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img src="/logo.svg" alt="Peer Project Hub" className="h-8 w-8 mr-3" />
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Peer Project Hub</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'nav-item-active'
                      : 'nav-item'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Dark mode toggle for mobile */}
            <div className="mt-auto px-4 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">Theme</span>
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r sidebar-bg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img src="/logo.svg" alt="Peer Project Hub" className="h-8 w-8 mr-3" />
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Peer Project Hub</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'nav-item-active'
                      : 'nav-item'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Dark mode toggle for desktop */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">Theme</span>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 header-bg">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  type="button"
                  className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Dark mode toggle for header (mobile only) */}
                <div className="md:hidden">
                  <DarkModeToggle />
                </div>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/create-project"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span className="hidden sm:block">Create Project</span>
                    </Link>
                    
                    <div className="relative">
                      <button
                        type="button"
                        className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                        onClick={handleLogout}
                      >
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
                            {user?.displayName?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <span className="hidden md:block">{user?.displayName}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/login"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-primary"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
