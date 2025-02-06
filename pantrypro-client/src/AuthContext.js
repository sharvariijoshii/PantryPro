import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user data
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} {/* Prevent rendering until loading is done */}
    </AuthContext.Provider>
  );
};

export default AuthContext;
