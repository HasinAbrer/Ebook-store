
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import SimpleNavbar from './components/SimpleNavbar'
import Footer from './components/Footer'
import UserMessage from './components/UserMessage'

import { useEffect, useState } from 'react'
import Loading from './components/Loading'

function App() {

  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const path = location.pathname || '';
  const hideFloating = path === '/contact-us' || path.startsWith('/dashboard');

  return (
    <>
      <SimpleNavbar />
      <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'>
        <Outlet />
      </main>
      <Footer />
      {!hideFloating && <UserMessage />}
    </>
  )
}

export default App