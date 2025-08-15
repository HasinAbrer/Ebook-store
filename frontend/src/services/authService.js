import axios from 'axios';
import getBaseUrl from '../utils/baseURL';

const API_BASE = getBaseUrl();

class AuthService {
  // User Registration
  async registerUser(username, password) {
    try {
      const response = await axios.post(`${API_BASE}/api/users/register`, {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // User Login
  async loginUser(username, password) {
    try {
      const response = await axios.post(`${API_BASE}/api/users/login`, {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Admin Login
  async loginAdmin(username, password) {
    try {
      const response = await axios.post(`${API_BASE}/api/users/admin`, {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Admin login failed');
    }
  }

  // Admin Registration
  async registerAdmin(username, password) {
    try {
      const response = await axios.post(`${API_BASE}/api/users/admin/register`, {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Admin registration failed');
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getToken();
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  // Validate token
  async validateToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await axios.get(`${API_BASE}/api/users/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.status === 200;
    } catch (error) {
      // Token is invalid, clear it
      this.logout();
      return false;
    }
  }
}

export default new AuthService();
