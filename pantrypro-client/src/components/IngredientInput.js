import React, { useState } from "react";
import axios from "axios";
import './IngredientInput.css';

const IngredientInput = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track if the button is clicked

  const handleSubmit = async () => {
    if (!ingredients.trim()) return; // Ensure ingredients are not empty

    try {
      const response = await axios.post("http://localhost:5001/api/recipes", {
        ingredients: ingredients.split(",").map((ingredient) => ingredient.trim()),
      });
      setRecipes(response.data);
      setIsSubmitted(true); // Set to true once the button is clicked and recipes are fetched
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
      <button className="submit-btn" onClick={handleSubmit}>Get Recipes</button>

      {/* Conditionally render recipes */}
      <div className="recipe-container">
        {selectedRecipe ? (
          <div className="recipe-detail">
            <button className="back-btn" onClick={handleBack}>Back to Recipes</button>
            <h2>{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} className="recipe-img" />
            <p><strong>Ingredients:</strong></p>
            <ul className="ingredients-list">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <p><strong>Instructions:</strong></p>
            <p>{selectedRecipe.instructions}</p>
          </div>
        ) : (
          <div className="recipe-list">
            {isSubmitted && recipes.length > 0 && (
              <h2 className="recipe-header">Recipes:</h2> // This header appears only after clicking "Get Recipes"
            )}
            {recipes.length === 0 && isSubmitted && !selectedRecipe && (
              <p>No recipes found. Try different ingredients.</p>
            )}
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-item"
                onClick={() => handleRecipeClick(recipe.id)}
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-thumbnail"
                />
                <h3 className="recipe-name">{recipe.title}</h3>
                <p className="recipe-details"><strong>Used Ingredients:</strong> {recipe.usedIngredients.join(", ")}</p>
                <p className="recipe-details"><strong>Missed Ingredients:</strong> {recipe.missedIngredients.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientInput;
