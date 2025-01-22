import React, { useState } from "react";
import axios from "axios";

const IngredientInput = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // To track the selected recipe

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/recipes", {
        ingredients: ingredients.split(",").map((ingredient) => ingredient.trim()),
      });
      setRecipes(response.data); // Update recipes with the fetched data
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleRecipeClick = async (recipeId) => {
    try {
      // Fetch detailed recipe information
      const response = await axios.get(`http://localhost:5001/api/recipes/${recipeId}`);
      setSelectedRecipe(response.data); // Update the selected recipe state
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const handleBack = () => {
    setSelectedRecipe(null); // Reset selected recipe to go back to the list
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>PantryPro</h1>
      <input
        type="text"
        placeholder="Enter ingredients (comma-separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{ padding: "10px", width: "300px", fontSize: "16px" }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          marginLeft: "10px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Get Recipes
      </button>

      <div style={{ marginTop: "20px" }}>
        {selectedRecipe ? (
          // Detailed recipe view
          <div>
            <button onClick={handleBack} style={{ marginBottom: "20px" }}>
              Back to Recipes
            </button>
            <h2>{selectedRecipe.title}</h2>
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              width="300"
              style={{ marginBottom: "20px" }}
            />
            <p><strong>Ingredients:</strong></p>
            <ul>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <p><strong>Instructions:</strong></p>
            <p>{selectedRecipe.instructions}</p>
          </div>
        ) : (
          // Recipe list view
          <div>
            <h2>Recipes:</h2>
            <ul>
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <li
                    key={recipe.id}
                    style={{ cursor: "pointer", textAlign: "left", margin: "10px 0" }}
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    <h3>{recipe.title}</h3>
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      width="100"
                      style={{ marginBottom: "10px" }}
                    />
                    <p><strong>Used Ingredients:</strong> {recipe.usedIngredients.join(", ")}</p>
                    <p><strong>Missed Ingredients:</strong> {recipe.missedIngredients.join(", ")}</p>
                  </li>
                ))
              ) : (
                <p>No recipes found. Try entering different ingredients.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientInput;
