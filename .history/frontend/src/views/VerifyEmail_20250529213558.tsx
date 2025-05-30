\lenovo\Downloads\Project-350\Frontend\src\views\VerifyEmail.tsx
import { FC, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const VerifyEmail: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (token && userId) {
      verifyEmail(token, userId);
    } else {
      setStatus('Invalid verification link');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string, userId: string) => {
    try {
      const response = await api.get(`/auth/verify?token=${token}&userId=${userId}`);
      if (response.data) {
        setStatus('Email verified successfully!');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      setStatus('Verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-bold">{status}</h2>
      </div>
    </div>
  );
};

export default VerifyEmail;