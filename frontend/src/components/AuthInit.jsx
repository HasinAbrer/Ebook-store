import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../redux/features/auth/authSlice';
import { cleanupAuthState, validateToken } from '../utils/tokenValidator';

const AuthInit = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUserRaw = localStorage.getItem('user');
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

      if (!storedToken) {
        // Nothing to do
        return;
      }

      // Validate token; cleanupAuthState will clear invalid tokens and redux
      await cleanupAuthState(storedToken, dispatch, clearUser);

      const stillValid = await validateToken(localStorage.getItem('token'));
      if (stillValid && storedUser) {
        // Only set if Redux doesn't already have token (avoid overwriting on login)
        const hasToken = !!token;
        if (!hasToken) {
          dispatch(setUser({ user: storedUser, token: storedToken }));
        }
      }
    };

    initializeAuth();
    // Only run on mount and when token changes availability
  }, [dispatch, token]);

  return children;
};

export default AuthInit;
