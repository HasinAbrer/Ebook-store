import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import getBaseUrl from '../utils/baseURL';
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../redux/features/auth/authSlice';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");

 const {
        register,
        handleSubmit,
        watch,
      } = useForm()

            const onSubmit = async (data) => {
                console.log(data);
        try {
            const response = await axios.post(`${getBaseUrl()}/api/users/admin`, data, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const auth = response.data;
            console.log(auth);
            if(auth.token){
                // Store admin token under a separate key to avoid user/admin cross-over
                localStorage.setItem('admin_token', auth.token);
                dispatch(setUser({ 
                    user: auth.user, 
                    token: auth.token 
                }));
                
                // Navigate to admin dashboard immediately
                navigate("/dashboard");
                
                // Session expiry after 1 hour
                setTimeout(() => {
                    localStorage.removeItem('admin_token');
                    dispatch(clearUser());
                    alert("Session expired, please login again");
                    navigate("/admin");
                }, 3600*1000)
            }
            alert("Admin Login successful!");
        } catch (error) {
            setMessage("Please provide a valid email and password")
            console.error(error)
        }
      }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
             Username
            </label>
            <input
              {...register("username", { required: true })}
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>

          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}

          <div>
            <button className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none">
              Login
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-gray-500 text-xs">
          ©2025 Ebook-store. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default AdminLogin