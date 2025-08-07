// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/users', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if necessary (e.g., Authorization token)
    },
});

export default axiosInstance;
