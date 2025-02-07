import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import "./IngredientInput.css";

const IngredientInput = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem("searchedRecipes");
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem("isSubmitted") === "true";
  });

  const { favorites, addFavorite, removeFavorite } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem("searchedRecipes", JSON.stringify(recipes));
    localStorage.setItem("isSubmitted", isSubmitted);
  }, [recipes, isSubmitted]);

  const handleSubmit = async () => {
    if (!ingredients.trim()) return;

    try {
      const response = await axios.post("http://localhost:5001/api/recipes", {
        ingredients: ingredients.split(",").map((ingredient) => ingredient.trim()),
      });
      setRecipes(response.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleRecipeClick = async (recipeId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/recipes/${recipeId}`);
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  const toggleFavorite = (recipe) => {
    if (favorites.some((fav) => fav.id === recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  return (
    <div className="container">
      <h1 className="main-heading">PantryPro</h1>
      <p className="tagline">Discover delicious recipes based on the ingredients you have!</p>

      <input
        type="text"
        className="ingredient-input"
        placeholder="Enter ingredients (comma-separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <button className="submit-btn" onClick={handleSubmit}>
        Get Recipes
      </button>

      <div className="recipe-container">
        {selectedRecipe ? (
          <div className="recipe-detail">
            <button className="back-btn" onClick={handleBack}>
              Back to Recipes
            </button>
            <h2>{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} className="recipe-img" />
            <p>
              <strong>Ingredients:</strong>
            </p>
            <ul className="ingredients-list">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <p>
              <strong>Instructions:</strong>
            </p>
            <p>{selectedRecipe.instructions}</p>
          </div>
        ) : (
          <div className="recipe-list">
            {isSubmitted && recipes.length > 0 && <h2 className="recipe-header">Recipes:</h2>}
            {recipes.length === 0 && isSubmitted && !selectedRecipe && (
              <p>No recipes found. Try different ingredients.</p>
            )}
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-item">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-thumbnail"
                  onClick={() => handleRecipeClick(recipe.id)}
                />
                <h3 className="recipe-name" onClick={() => handleRecipeClick(recipe.id)}>
                  {recipe.title}
                </h3>
                <p className="used-ingredients">
                  <strong>Used Ingredients:</strong>{" "}
                  <span className="used-ingredients-list">{recipe.usedIngredients.join(", ")}</span>
                </p>
                <p className="missed-ingredients">
                  <strong>Missed Ingredients:</strong>{" "}
                  <span className="missed-ingredients-list">{recipe.missedIngredients.join(", ")}</span>
                </p>
                <button className="favorite-btn" onClick={() => toggleFavorite(recipe)}>
                  {favorites.some((fav) => fav.id === recipe.id) ? "❤️ Remove" : "🤍 Favorite"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientInput;
