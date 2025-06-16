import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Added this import

const DashboardLayout = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const navigate = (path) => {
    // Mock navigation function for demo
    console.log('Navigate to:', path);
  };

  const handleLogout = () => {
    // Mock logout function
    navigate("/");
  };

  const navItems = [
    { id: 'folders', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', path: '#' },
    { id: 'dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', path: '/dashboard' },
    { id: 'add-book', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', path: '/dashboard/add-new-book' },
    { id: 'manage-books', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', path: '/dashboard/manage-books' }
  ];

  return (
    <>
    <section className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`hidden sm:flex sm:flex-col relative z-10 transition-all duration-300 ${sidebarHovered ? 'w-20' : 'w-20'}`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Logo */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <a href="/" className="relative inline-flex items-center justify-center h-20 w-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:from-purple-500 focus:to-pink-500 rounded-2xl m-2 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
            </div>
          </a>
        </div>

        {/* Navigation */}
        <div className="flex-grow flex flex-col justify-between">
          <nav className="flex flex-col mx-2 my-6 space-y-4">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  activeNav === item.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl shadow-purple-500/50'
                    : 'bg-white/10 backdrop-blur-lg opacity-0 group-hover:opacity-100'
                }`}></div>
                <Link
                  to={item.path}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative inline-flex items-center justify-center py-4 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    activeNav === item.id
                      ? 'text-white shadow-lg'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span className="sr-only">{item.id}</span>
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                </Link>
              </div>
            ))}
          </nav>

          {/* Settings */}
          <div className="mx-2 mb-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <button className="relative w-full p-4 text-white/70 hover:text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <span className="sr-only">Settings</span>
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow text-white relative z-10">
        {/* Header */}
        <header className="flex items-center h-20 px-6 sm:px-10 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border-b border-white/20"></div>

          <button className="block sm:hidden relative flex-shrink-0 p-2 mr-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
            <span className="sr-only">Menu</span>
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          {/* Search */}
          <div className="relative w-full max-w-md sm:-ml-2 z-10">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl"></div>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="absolute h-5 w-5 mt-3 ml-4 text-white/50 z-10">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              role="search"
              placeholder="Search..."
              className="relative py-3 pl-12 pr-4 w-full bg-transparent border-0 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-2xl text-white"
            />
          </div>

          {/* Header Actions */}
          <div className="flex flex-shrink-0 items-center ml-auto space-x-4 relative z-10">
            {/* User Profile */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <button className="relative inline-flex items-center p-2 rounded-2xl transition-all duration-300 transform hover:scale-105">
                <div className="hidden md:flex md:flex-col md:items-end md:leading-tight mr-3">
                  <span className="font-semibold text-white">Grace Simmons</span>
                  <span className="text-sm text-white/70">Lecturer</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-sm opacity-75"></div>
                  <span className="relative h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full overflow-hidden flex items-center justify-center">
                    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="user profile photo" className="h-full w-full object-cover rounded-full"/>
                  </span>
                </div>
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="hidden sm:block h-5 w-5 text-white/50 ml-2">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <button className="relative p-3 text-white/70 hover:text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                  <span className="sr-only">Notifications</span>
                  <div className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-1 right-1 h-3 w-3 bg-red-400 rounded-full animate-ping"></div>
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>

              {/* Logout */}
              <div className="relative group">
                <div className="absolute inset-0 bg-red-500/20 backdrop-blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <button
                  onClick={handleLogout}
                  className="relative p-3 text-white/70 hover:text-red-400 rounded-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="sr-only">Log out</span>
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 sm:p-10 space-y-6 relative">
          {/* Title Section */}
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
            <div className="mr-6">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <h2 className="text-xl text-white/70 ml-0.5 font-light">Book Store Inventory</h2>
            </div>

              {/* Action Buttons */}
                <div className="flex flex-col md:flex-row items-start justify-end -mb-3 space-y-3 md:space-y-0 md:space-x-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>
                    <Link
                      to="/dashboard/manage-books"
                      className="relative inline-flex items-center px-6 py-3 text-white bg-white/10 backdrop-blur-lg hover:bg-white/20 border border-white/20 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Manage Books
                    </Link>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <Link
                      to="/dashboard/add-new-book"
                      className="relative inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Book
                    </Link>
                  </div>
                </div>
              </div>
            {/* Content Area */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
              <div className="relative p-8 rounded-3xl min-h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Welcome to Your Dashboard</h3>
                  <p className="text-white/70">Your outlet content will be rendered here</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default DashboardLayout;