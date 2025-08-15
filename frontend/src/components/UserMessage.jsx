import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserMessage = () => {
  const { token } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const goContact = () => {
    if (!token) {
      navigate('/login');
    } else {
      navigate('/contact-us');
    }
  };

  // Only logged-in users can send; unauthenticated users will be redirected to login when submitting

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={goContact}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center space-x-2"
        title="Contact Admin"
      >
        <FaEnvelope className="h-5 w-5" />
        <span className="hidden sm:inline">Contact Admin</span>
      </button>
    </div>
  );
};

export default UserMessage;
