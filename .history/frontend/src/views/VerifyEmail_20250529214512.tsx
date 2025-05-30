import { FC, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    const verifyEmail = async () => {
      if (!token || !userId) {
        setStatus('Invalid verification link');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/auth/verify?token=${token}&userId=${userId}`);
        if (response.status === 200) {
          setStatus('Email verified successfully!');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        setStatus('Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900">{status}</h2>
      </div>
    </div>
  );
};

export default VerifyEmail;