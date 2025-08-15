import axios from 'axios';
import getBaseUrl from './baseURL';

// Function to validate if a token is still valid
export const validateToken = async (token) => {
  if (!token) return false;
  
  try {
    // Try to make a simple authenticated request
    const response = await axios.get(`${getBaseUrl()}/api/users/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.status === 200;
  } catch (error) {
    // If token is invalid, expired, or any other error
    return false;
  }
};

// Function to clear invalid tokens
export const clearInvalidToken = () => {
  localStorage.removeItem('token');
  // Also clear any other auth-related data
  localStorage.removeItem('login');
  localStorage.removeItem('user');
};

// Function to check and clean up authentication state
export const cleanupAuthState = async (token, dispatch, clearUser) => {
  if (!token) return;
  
  const isValid = await validateToken(token);
  if (!isValid) {
    clearInvalidToken();
    dispatch(clearUser());
    console.log('Invalid token cleared');
  }
};
