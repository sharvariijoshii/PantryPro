import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import ImageIngredientUpload from "./ImageIngredientUpload";
import "../styles/IngredientInput.css";

const IngredientInput = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem("searchedRecipes");
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem("isSubmitted") === "true";
  });
  const [loading, setLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const { favorites, addFavorite, removeFavorite } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("searchedRecipes", JSON.stringify(recipes));
    localStorage.setItem("isSubmitted", isSubmitted);
  }, [recipes, isSubmitted]);

  const handleSubmit = async () => {
    if (!ingredients.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5001/api/recipes", {
        ingredients: ingredients.split(",").map((ingredient) => ingredient.trim()),
      });
      setRecipes(response.data);
      setIsSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setLoading(false);
    }
  };

  const toggleFavorite = (recipe) => {
    if (favorites.some((fav) => fav.id === recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };
  
  const handleIngredientsRecognized = (recognizedIngredients) => {
    if (recognizedIngredients && recognizedIngredients.length > 0) {
      // Join the recognized ingredients with commas
      const ingredientsString = recognizedIngredients.join(", ");
      setIngredients(ingredientsString);
      
      // Hide the image upload section
      setShowImageUpload(false);
      
      // Automatically search for recipes with the recognized ingredients
      handleSubmit();
    }
  };

  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload);
  };

  return (
    <div className={`ingredient-input-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1 className="app-title">PantryPro</h1>
      <p className="app-description">
        Discover delicious recipes based on the ingredients you have!
      </p>

      <div className="input-card">
        <div className="input-row">
          <input
            type="text"
            className="ingredient-input"
            placeholder="Enter ingredients (comma-separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            className="camera-button"
            onClick={toggleImageUpload}
            title="Recognize ingredients from image"
          >
            📷
          </button>
        </div>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Get Recipes'}
        </button>
      </div>
      
      {showImageUpload && (
        <ImageIngredientUpload onIngredientsRecognized={handleIngredientsRecognized} />
      )}

      {/* Recipe Results */}
      <div className="recipes-container">
        <div className="recipes-grid">
          {isSubmitted && recipes.length > 0 && <h2 className="recipes-heading">Recipes:</h2>}
          {recipes.length === 0 && isSubmitted && (
            <p className="no-recipes-message">No recipes found. Try different ingredients.</p>
          )}
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSaveToFavorites={toggleFavorite}
              isFavorite={favorites.some((fav) => fav.id === recipe.id)}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientInput;
