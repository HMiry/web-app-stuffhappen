import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Check if user is logged in on app start
  useEffect(() => {
    const savedAuth = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('selectedTheme');
    
    if (savedAuth === 'true' && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }

    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
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

  const value = {
    isLoggedIn,
    user,
    selectedTheme,
    login,
    logout,
    selectTheme
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 