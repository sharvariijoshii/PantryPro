import React, { useState } from "react";
import axios from "axios";

const IngredientInput = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/recipes", {
        ingredients: ingredients.split(",").map((ingredient) => ingredient.trim())
      });
      console.log("Response data:", response.data); // Verify the response in the console
      setRecipes(response.data); // Update the state with the response
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
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
        <h2>Recipes:</h2>
        <ul>
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <li key={index}>
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
    </div>
  );
};

export default IngredientInput;

