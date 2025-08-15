import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/auth/authSlice';
import authService from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.registerUser(formData.username, formData.password);
      
      // Update Redux state
      dispatch(setUser({
        user: response.user,
        token: response.token
      }));

      alert("Registration successful!");
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-[calc(100vh-120px)] flex justify-center items-center '>
      <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h2 className='text-xl font-semibold mb-4'>Please Register</h2>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder='Username'
              value={formData.username}
              onChange={handleChange}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder='Confirm Password'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
            />
          </div>
          {
            error && <p className='text-red-500 text-xs italic mb-3'>{error}</p>
          }
          <div>
            <button 
              type="submit"
              disabled={isLoading}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none disabled:opacity-50'
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <p className='align-baseline font-medium mt-4 text-sm'>Have an account? Please <Link to="/login" className='text-blue-500 hover:text-blue-700'>Login</Link></p>

        <p className='mt-5 text-center text-gray-500 text-xs'>©2025 Book Store. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Register;