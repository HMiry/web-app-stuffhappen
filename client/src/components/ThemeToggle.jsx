import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
// Just the design of the theme toggle button the logic is in the ThemeContext.jsx
const ThemeToggle = ({ style = {}, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`d-flex align-items-center justify-content-center border-0 rounded-circle ${className}`}
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: isDark ? '#fbbf24' : '#1a1a1a',
        color: isDark ? '#1a1a1a' : '#fbbf24',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

export default ThemeToggle; 