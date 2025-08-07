import { useEffect, useState, useContext, createContext } from "react";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const SESSION_KEY = "dev_session_id"; // constant key

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //protibar e reload er somoy session key ta thake, jodi na thake tahole logout hoye jabe
  //reload e logged out hobe nah,estart e logged out hobe
  const currentSession = sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, currentSession);

  useEffect(() => {
    // If the session key is missing on app start (means a true restart), sign out
    if (!sessionStorage.getItem(SESSION_KEY)) {
      signOut(auth);
      setCurrentUser(null);
    }
  }, []);

  // register a user
  const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // login the user
  const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // sign in with Google
  const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  // logout the user
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem(SESSION_KEY); // remove session key on logout
    await signOut(auth);
    setCurrentUser(null);
  };

  // manage user state from Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      // You can process user data here if needed
      if (user) {
        const { email, displayName, photoURL } = user;
        const _userData = {
          email,
          username: displayName,
          photo: photoURL,
        };
        // Optional: do something with _userData
      }
    });

    return () => unsubscribe();
  }, []);

  // Optional token validation logic
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCurrentUser(null);
    } else {
      // You need to define verifyToken elsewhere or remove this block if unused
      verifyToken(token)
        .then((user) => setCurrentUser(user))
        .catch(() => {
          logout(); // Token invalid — logout
        });
    }
  }, []);

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default { AuthContext, AuthProvider };
