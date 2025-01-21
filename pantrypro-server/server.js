const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Spoonacular API configuration
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

// Route to fetch recipes by ingredients
app.post("/api/recipes", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "Ingredients are required." });
  }

  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/findByIngredients`, {
      params: {
        ingredients: ingredients.join(","),
        number: 10, // Number of recipes to return
        apiKey: SPOONACULAR_API_KEY,
      },
    });

    const recipes = response.data.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients.map((ing) => ing.name),
      missedIngredients: recipe.missedIngredients.map((ing) => ing.name),
    }));

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes. Please try again later." });
  }
});

// Route to fetch ingredient pricing
app.post("/api/ingredient-prices", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "Ingredients are required." });
  }

  try {
    const ingredientPrices = await Promise.all(
      ingredients.map(async (ingredient) => {
        const response = await axios.get(`${SPOONACULAR_BASE_URL}/food/ingredients/search`, {
          params: {
            query: ingredient,
            apiKey: SPOONACULAR_API_KEY,
          },
        });

        if (response.data.results.length > 0) {
          const firstResult = response.data.results[0];
          return { ingredient, price: `$${(Math.random() * 10).toFixed(2)}` }; // Mock price
        } else {
          return { ingredient, price: "N/A" };
        }
      })
    );

    res.json(ingredientPrices);
  } catch (error) {
    console.error("Error fetching ingredient prices:", error);
    res.status(500).json({ error: "Failed to fetch ingredient prices. Please try again later." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
