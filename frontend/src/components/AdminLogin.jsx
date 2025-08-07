import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import getBaseUrl from '../utils/baseURL';  // Utility function to get the base URL
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();  // Hook to navigate between pages
  const [message, setMessage] = useState("");  // To display any error messages
  const [loading, setLoading] = useState(false); // To track loading state

  const { register, handleSubmit, formState: { errors }, reset } = useForm();  // react-hook-form for form handling

  const onSubmit = async (data) => {
    console.log(data);  // Log the form data (email and password)

    setLoading(true); // Start loading

    try {
      // Making the POST request to the admin login API
      const response = await axios.post(`${getBaseUrl()}/api/users/admin`, {
        email: data.username,  // Using the username field as email for login
        password: data.password
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      const auth = response.data;
      console.log(auth);  // Log the response data to see the returned token

      if (auth.token) {
        // ✅ Store token in localStorage for session management
        localStorage.setItem('token', auth.token);

        // ✅ Set session expiration (1 hour)
        setTimeout(() => {
          localStorage.removeItem('token');
          alert("Session expired, please login again");
          navigate("/admin"); // Redirect back to login after expiration
        }, 3600 * 1000); // 1 hour in milliseconds

        alert("Admin Login successful!");

        // ✅ Navigate immediately to admin dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      // If there's an error, show an error message
      setMessage(error.response?.data?.message || "Invalid credentials. Please provide a valid email and password.");
      console.error(error);  // Log the error for debugging
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Email
            </label>
            <input
              {...register("username", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  message: "Invalid email address"
                }
              })}
              type="email"  // Use type="email" for better user experience
              id="username"
              placeholder="Enter your email"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic">{errors.username.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password.message}</p>
            )}
          </div>

          {/* Error Message */}
          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-gray-500 text-xs">
          ©2025 Ebook-store. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
