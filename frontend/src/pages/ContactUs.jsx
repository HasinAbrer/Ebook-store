import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MyMessages from './messages/MyMessages.jsx';

const ContactUs = () => {
  const { token } = useSelector((s) => s.auth);

  if (!token) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Contact & Messages</h1>
        <p className="text-center text-gray-600 mb-6">Please log in to contact admin and view your messages.</p>
        <div className="text-center">
          <Link to="/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Messages</h1>
      <MyMessages />
    </div>
  );
}

export default ContactUs;
