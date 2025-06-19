import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
// This is the logic for the theme toggle button
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  useEffect(() => {
    // Apply theme class to body
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 