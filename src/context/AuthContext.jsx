// ATHENAEUM — Authentication Context Provider
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getStoredAuth, 
  setStoredAuth, 
  clearStoredAuth, 
  loginUser, 
  registerUser, 
  loginAsDemoCurator, 
  logoutUser 
} from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state from storage on app load
  useEffect(() => {
    const { token: savedToken, user: savedUser } = getStoredAuth();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await loginUser({ email, password });
      setToken(res.token);
      setCurrentUser(res.user);
      return res;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    }
  };

  // Sign up handler (Initializes zero data vault)
  const signup = async ({ name, email, password, role }) => {
    setAuthError(null);
    try {
      const res = await registerUser({ name, email, password, role });
      setToken(res.token);
      setCurrentUser(res.user);
      return res;
    } catch (err) {
      setAuthError(err.message || 'Signup failed');
      throw err;
    }
  };

  // 1-Click Demo Login
  const loginDemo = async () => {
    setAuthError(null);
    try {
      const res = await loginAsDemoCurator();
      setToken(res.token);
      setCurrentUser(res.user);
      return res;
    } catch (err) {
      setAuthError(err.message || 'Demo login failed');
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Continue cleanup
    }
    setToken(null);
    setCurrentUser(null);
    setAuthError(null);
  };

  // Update profile
  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setStoredAuth(token, updated);
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: Boolean(currentUser && token),
    isLoading,
    authError,
    setAuthError,
    login,
    signup,
    loginDemo,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
