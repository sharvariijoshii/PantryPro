import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from './ThemeToggle';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  // Hide the Favorites button on the login and register pages.
  // (Assuming your register page is at "/" or "/register" as needed.)
  const hideFavorites = location.pathname === "/login" || location.pathname === "/" || location.pathname === "/register";

  return (
    <nav className={`navbar ${darkMode ? 'dark-mode' : ''}`}>
      {/* Pantrypro logo always visible */}
      <h2
        className="navbar-logo"
        onClick={() => navigate("/recipes")}
      >
        Pantrypro
      </h2>

      {/* Right Section: Favorites (conditionally rendered) & User Dropdown */}
      <div className="navbar-items">
        <ThemeToggle />
        {!hideFavorites && (
          <button
            onClick={() => navigate("/favorites")}
            className="navbar-link"
          >
            <span>❤️ Favorites</span>
          </button>
        )}

        {!hideFavorites && (
          <button
            onClick={() => navigate("/meal-planner")}
            className="navbar-link"
          >
            <span>📅 Meal Planner</span>
          </button>
        )}
        
        {!hideFavorites && (
          <button
            onClick={() => navigate("/nutrition")}
            className="navbar-link"
          >
            <span>📊 Nutrition</span>
          </button>
        )}

        {user ? (
          <div className="user-dropdown">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="navbar-user"
            >
              {user.username} ▼
            </button>
            {dropdownOpen && (
              <div className={`dropdown-menu ${darkMode ? 'dark-mode' : ''}`}>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="login-button"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
