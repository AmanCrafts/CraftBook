import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import authAPI from "../api/auth.api";
import userAPI from "../api/user.api";

const AuthContext = createContext({});

const TOKEN_KEY = "craftbook_auth_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        const userData = await authAPI.getCurrentUser(token);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for existing token on app start
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    const result = await authAPI.login({ email, password });
    await AsyncStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
    setIsAuthenticated(true);
    return result;
  };

  const register = async (email, password, name) => {
    const result = await authAPI.register({ email, password, name });
    await AsyncStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
    setIsAuthenticated(true);
    return result;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const changeEmail = async (newEmail, currentPassword) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Not authenticated");

    const updatedUser = await authAPI.changeEmail(
      newEmail,
      currentPassword,
      token
    );
    setUser(updatedUser);
    return updatedUser;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Not authenticated");

    return await authAPI.changePassword(currentPassword, newPassword, token);
  };

  const deleteAccount = async () => {
    if (!user) throw new Error("Not authenticated");

    await userAPI.deleteUserWithAllData(user.id);
    await logout();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    changeEmail,
    changePassword,
    deleteAccount,
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
