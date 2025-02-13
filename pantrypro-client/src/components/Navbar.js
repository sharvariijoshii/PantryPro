import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
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
    <nav className="bg-white text-indigo-700 py-4 shadow-md flex justify-between items-center px-6">
      {/* Pantrypro logo always visible */}
      <h2
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/recipes")}
      >
        Pantrypro
      </h2>

      {/* Right Section: Favorites (conditionally rendered) & User Dropdown */}
      <div className="flex items-center space-x-4 relative">
        {!hideFavorites && (
          <button
            onClick={() => navigate("/favorites")}
            className="text-indigo-700 text-lg font-bold cursor-pointer flex items-center space-x-2 hover:text-red-400 transition"
          >
            <span>♥️ Favorites</span>
          </button>
        )}

        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-indigo-700 text-lg font-semibold hover:underline"
            >
              {user.username} ▼
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg py-2 w-32">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
