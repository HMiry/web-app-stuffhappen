import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.mjs';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('university');
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkSession = async () => {
      const savedAuth = localStorage.getItem('isLoggedIn');
      const savedUser = localStorage.getItem('user');
      const savedTheme = localStorage.getItem('selectedTheme');
      
      // Set theme first
      if (savedTheme) {
        setSelectedTheme(savedTheme);
      }

      // Check if we have local auth data
      if (savedAuth === 'true' && savedUser) {
        try {
          // Verify session with server
          const result = await API.auth.checkSession();
          if (result.success && result.data.authenticated) {
            setIsLoggedIn(true);
            setUser(result.data.user);
            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(result.data.user));
          } else {
            // Session invalid, clear local storage
            logout();
          }
        } catch (error) {
          console.error('Session check failed:', error);
          // Clear invalid session data
          logout();
        }
      }
      
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = async (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call API logout to clear server session
      await API.auth.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    // Clear local state and storage
    setIsLoggedIn(false);
    setUser(null);
    setSelectedTheme('university'); // Reset to default theme on logout
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.setItem('selectedTheme', 'university');
  };

  const selectTheme = (themeId) => {
    setSelectedTheme(themeId);
    localStorage.setItem('selectedTheme', themeId);
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = {
    isLoggedIn,
    user,
    selectedTheme,
    loading,
    login,
    logout,
    selectTheme,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 