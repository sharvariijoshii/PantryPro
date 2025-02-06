const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

// Database Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Register New User
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      console.log("Missing fields in registration");
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ firstName, lastName, username, email, password: hashedPassword });
    await user.save();

    console.log("User registered successfully");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login User
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate authentication token
    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Middleware to Verify JWT Token
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// ======= Existing API Routes =======

// Fetch Recipes by Ingredients
app.post("/api/recipes", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "Ingredients are required." });
  }

  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/findByIngredients`, {
      params: { ingredients: ingredients.join(","), number: 10, apiKey: SPOONACULAR_API_KEY },
    });

    const recipes = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients.map(ing => ing.name),
      missedIngredients: recipe.missedIngredients.map(ing => ing.name),
    }));

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes. Please try again later." });
  }
});

// Fetch Detailed Recipe by ID
app.get("/api/recipes/:id", async (req, res) => {
  const recipeId = req.params.id;

  if (!recipeId) {
    return res.status(400).json({ error: "Recipe ID is required." });
  }

  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${recipeId}/information`, {
      params: { apiKey: SPOONACULAR_API_KEY },
    });

    res.json({
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      ingredients: response.data.extendedIngredients.map(ing => ing.name),
      instructions: response.data.instructions,
    });
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    res.status(500).json({ error: "Failed to fetch recipe details. Please try again later." });
  }
});

// Fetch Ingredient Pricing (Mock Data)
app.post("/api/ingredient-prices", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "Ingredients are required." });
  }

  try {
    const ingredientPrices = await Promise.all(
      ingredients.map(async ingredient => {
        const response = await axios.get(`${SPOONACULAR_BASE_URL}/food/ingredients/search`, {
          params: { query: ingredient, apiKey: SPOONACULAR_API_KEY },
        });

        if (response.data.results.length > 0) {
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
