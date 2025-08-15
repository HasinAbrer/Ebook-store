import { useEffect, useState, useContext, createContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../redux/features/auth/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext)
}

// Simplified AuthProvider that works with Redux
export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { user, token } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);

    // For compatibility with existing components
    const currentUser = user;

    // Simplified auth functions for basic compatibility
    const createUser = async (email, password) => {
        // This would typically integrate with your backend registration
        console.log('Registration not implemented in simplified version');
        return Promise.resolve();
    }

    const login = async (email, password) => {
        // This would typically integrate with your backend login
        console.log('Login not implemented in simplified version');
        return Promise.resolve();
    }

    const googleLogin = async () => {
        // This would typically integrate with your backend Google login
        console.log('Google login not implemented in simplified version');
        return Promise.resolve();
    }

    const logout = () => {
        localStorage.removeItem('token');
        dispatch(clearUser());
        return Promise.resolve();
    }

    const value = {
        currentUser,
        createUser,
        login,
        googleLogin,
        logout,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default { AuthContext, AuthProvider };