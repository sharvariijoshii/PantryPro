import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Import AuthContext
import Register from "./pages/Register";
import Login from "./pages/Login";
import IngredientInput from "./components/IngredientInput";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Show loading indicator

  return (
    <>
      {user && <Navbar />} {/* Show Navbar only when user is logged in */}
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute> {/* Protect the /recipes route */}
              <div className="App">
                <IngredientInput />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? "/recipes" : "/login"} />} />
      </Routes>
    </>
  );
}

export default App;
