import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="theme-toggle">
      <button 
        onClick={toggleTheme} 
        className={`theme-toggle-btn ${darkMode ? 'dark' : 'light'}`}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <>
            <span className="toggle-icon">☀️</span>
            <span className="toggle-text">Light Mode</span>
          </>
        ) : (
          <>
            <span className="toggle-icon">🌙</span>
            <span className="toggle-text">Dark Mode</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
