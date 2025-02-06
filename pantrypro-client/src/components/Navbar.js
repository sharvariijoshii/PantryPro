import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  console.log("Navbar User:", user); // Debugging log

  return (
    <nav style={styles.navbar}>
      <h2>PantryPro</h2>
      <div style={styles.userSection}>
        {user ? (
          <div style={styles.dropdownContainer}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={styles.userButton}>
              {user.username} ▼ {/* Displaying username */}
            </button>
            {dropdownOpen && (
              <div style={styles.dropdownMenu}>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate("/login")} style={styles.loginButton}>Login</button>
        )}
      </div>
    </nav>
  );
};


// Simple inline styles for minimal styling
const styles = {
  navbar: { display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "white" },
  userSection: { position: "relative" },
  userButton: { background: "none", color: "white", border: "none", cursor: "pointer", fontSize: "16px" },
  dropdownContainer: { position: "relative" },
  dropdownMenu: { position: "absolute", top: "100%", right: 0, background: "white", color: "black", padding: "5px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "5px" },
  logoutButton: { background: "red", color: "white", border: "none", padding: "5px", cursor: "pointer" },
  loginButton: { background: "green", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" },
};

export default Navbar;
