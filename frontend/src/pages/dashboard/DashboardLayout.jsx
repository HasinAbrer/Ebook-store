import React, { useEffect, useState } from 'react'

import Loading from '../../components/Loading';
import { Link, Outlet, useNavigate, NavLink } from 'react-router-dom';
import { FaUsers, FaShoppingBag, FaRegCommentDots, FaEnvelopeOpenText, FaCog } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/features/auth/authSlice';
import { useGetMyProfileQuery } from '../../redux/features/profile/profileApi';
import avatarImg from '../../assets/avatar.png';
import getBaseUrl from '../../utils/baseURL';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  // Fetch admin's own profile for header avatar/name (explicitly with admin_token to avoid crossover)
  const [adminHeaderProfile, setAdminHeaderProfile] = useState(null);
  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { setAdminHeaderProfile(null); return; }
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/api/profile/me`, {
          headers: { Authorization: `Bearer ${t}` },
          signal: controller.signal,
        });
        const data = await res.json();
        setAdminHeaderProfile(data || null);
      } catch (_) {
        setAdminHeaderProfile(null);
      }
    })();
    return () => controller.abort();
  }, [token]);

  // Restore admin token from localStorage on component mount
  useEffect(() => {
    const storedAdminToken = localStorage.getItem('admin_token');
    if (storedAdminToken && !token) {
      // Restore only the token; do not force role/user to avoid cross-over
      dispatch(setUser({ user: null, token: storedAdminToken }));
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    dispatch(setUser({ user: null, token: null }));
    navigate("/")
  }

  return (
    <section className="flex md:bg-gray-100 min-h-screen overflow-hidden">
    <aside className="hidden sm:flex sm:flex-col">
      <a href="/" className="inline-flex items-center justify-center h-20 w-20 bg-purple-600 hover:bg-purple-500 focus:bg-purple-500">
        <img src="/fav-icon.png" alt="" />
      </a>
      <div className="flex-grow flex flex-col justify-between text-gray-500 bg-gray-800">
        <nav className="flex flex-col mx-4 my-6 space-y-4">

          <Link to="/dashboard" className="inline-flex items-center justify-center py-3 text-purple-600 bg-white rounded-lg">
            <span className="sr-only">Dashboard</span>
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </Link>
          {/** Removed Add/Manage Books icons per request */}
          <Link to="/dashboard/users" className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
            <span className="sr-only">Users</span>
            <FaUsers className="h-6 w-6"/>
          </Link>
          <Link to="/dashboard/orders" className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
            <span className="sr-only">Orders</span>
<FaShoppingBag className="h-6 w-6"/>
          </Link>
          <Link to="/dashboard/reviews" className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
            <span className="sr-only">Reviews</span>
            <FaRegCommentDots className="h-6 w-6"/>
          </Link>
          <Link to="/dashboard/messages" className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
            <span className="sr-only">Messages</span>
            <FaEnvelopeOpenText className="h-6 w-6"/>
          </Link>
        </nav>
        <div className="inline-flex items-center justify-center h-20 w-20 border-t border-gray-700">
          <Link to="/dashboard/settings" className="p-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
            <span className="sr-only">Settings</span>
            <FaCog className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </aside>
    <div className="flex-grow text-gray-800">
      <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
        <button className="block sm:hidden relative flex-shrink-0 p-2 mr-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800 rounded-full">
          <span className="sr-only">Menu</span>
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
        <div className="flex flex-shrink-0 items-center ml-auto gap-4">
          <Link to="/dashboard/settings" className="flex items-center gap-2 group">
            <img
              src={adminHeaderProfile?.photoUrl || avatarImg}
              alt="admin avatar"
              className="w-8 h-8 rounded-full object-cover border"
            />
            <span className="hidden sm:block text-sm text-gray-700 group-hover:text-gray-900">
              {adminHeaderProfile?.displayName || 'Admin'}
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="p-6 sm:p-10 space-y-6 ">
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
          <div className="mr-6">
            <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
            <h2 className="text-gray-600 ml-0.5">Book Store Inventory</h2>
          </div>
          {/** Removed Add/Manage Books actions per request */}
        </div>
       <Outlet/>
      </main>
    </div>
    {/** Admin floating chat removed per request */}
  </section>
  )
}

export default DashboardLayout