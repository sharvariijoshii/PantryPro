import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">PantryPro</h1>
      <p className="text-gray-600 mb-6 text-center text-lg max-w-lg">
        Discover delicious recipes based on the ingredients you have!
      </p>

      <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-2xl">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
          placeholder="Enter ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition mt-4"
          onClick={handleSubmit}
        >
          Get Recipes
        </button>
      </div>

      {/* Recipe Results */}
      <div className="w-full max-w-4xl mt-8">
        {selectedRecipe ? (
          <div className="bg-white p-6 shadow-lg rounded-2xl">
            <button
              className="mb-4 text-indigo-600 font-semibold hover:underline"
              onClick={handleBack}
            >
              ⬅ Back to Recipes
            </button>
            <h2 className="text-2xl font-bold text-indigo-700">{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-60 object-cover rounded-lg shadow-md my-4" />
            <p className="text-gray-700 font-semibold">Ingredients:</p>
            <ul className="list-disc pl-6 text-gray-600">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <p className="text-gray-700 font-semibold mt-4">Instructions:</p>
            <p className="text-gray-600">{selectedRecipe.instructions}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isSubmitted && recipes.length > 0 && <h2 className="col-span-full text-center text-2xl font-bold text-gray-700">Recipes:</h2>}
            {recipes.length === 0 && isSubmitted && !selectedRecipe && (
              <p className="text-gray-600 text-lg text-center col-span-full">No recipes found. Try different ingredients.</p>
            )}
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-40 object-cover rounded-lg"
                  onClick={() => handleRecipeClick(recipe.id)}
                />
                <h3 className="text-lg font-bold text-gray-700 mt-2 text-center" onClick={() => handleRecipeClick(recipe.id)}>
                  {recipe.title}
                </h3>
                <p className="text-sm text-green-600 font-semibold mt-1">Used: {recipe.usedIngredients.join(", ")}</p>
                <p className="text-sm text-red-600 font-semibold">Missed: {recipe.missedIngredients.join(", ")}</p>
                <button
                  className="w-full bg-gray-200 text-gray-700 font-semibold py-1 mt-3 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => toggleFavorite(recipe)}
                >
                  {favorites.some((fav) => fav.id === recipe.id) ? "♥️ Remove" : "♡ Favorite"}
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
