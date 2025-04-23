import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Import AuthContext
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import Register from "./pages/Register";
import Login from "./pages/Login";
import IngredientInput from "./components/IngredientInput";
import Navbar from "./components/Navbar";
import FavoriteRecipes from "./components/FavoriteRecipes";
import MealPlannerPage from "./pages/MealPlannerPage";
import RecipeDetails from "./components/RecipeDetails"; // Import RecipeDetails
import NutritionDashboard from "./components/NutritionDashboard"; // Import NutritionDashboard
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import "./styles/theme.css"; // Import theme styles

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Show loading indicator

  return (
    <ThemeProvider>
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
          <Route path="/favorites" element={<ProtectedRoute><FavoriteRecipes /></ProtectedRoute>} />
          <Route path="/meal-planner" element={<ProtectedRoute><MealPlannerPage /></ProtectedRoute>} />
          <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><NutritionDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={user ? "/recipes" : "/login"} />} />
        </Routes>
      </>
    </ThemeProvider>
  );
}

export default App;
