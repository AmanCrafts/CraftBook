import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import userAPI from "../api/user.api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsAuthenticated(true);

          // Fetch user profile from database
          try {
            const userData = await userAPI.getUserByGoogleId(firebaseUser.uid);
            setDbUser(userData);
          } catch (error) {
            console.error("User profile not found in database:", error);
            setDbUser(null);
          }
        } else {
          setUser(null);
          setDbUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, [auth]);

  const value = {
    user,
    dbUser,
    loading,
    isAuthenticated,
    setDbUser, // Allow manual update after profile completion
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
