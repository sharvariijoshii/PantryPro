const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connectDB = require("./db"); // Import the database connection function
require("dotenv").config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_key';
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

// Development mode flag - set to true to use mock authentication
const DEVELOPMENT_MODE = true;

// Mock users for development
const mockUsers = [
  {
    _id: '1',
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2a$10$XFE/UaYmU7SLy3rUP.ZxZOvmUwOdcLp4iRMUDJfLrVxXOZIW.7ydm' // hashed 'password123'
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Connection
let dbConnected = false;
(async () => {
  if (!DEVELOPMENT_MODE) {
    dbConnected = await connectDB();
    if (!dbConnected) {
      console.warn("Warning: Running without database connection. Using mock authentication.");
    }
  } else {
    console.log("Running in development mode with mock authentication.");
  }
})();

// User Schema & Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

// Register New User
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      console.log("Missing fields in registration");
      return res.status(400).json({ message: "All fields are required" });
    }

    // In development mode or if DB is not connected, use mock users
    if (DEVELOPMENT_MODE || !dbConnected) {
      // Check if user already exists in mock users
      const existingUser = mockUsers.find(user => user.email === email || user.username === username);
      if (existingUser) {
        console.log("User already exists");
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new mock user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = {
        _id: (mockUsers.length + 1).toString(),
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword
      };
      
      mockUsers.push(newUser);
      console.log("Mock user registered successfully");
      return res.status(201).json({ message: "User registered successfully" });
    }

    // If not in development mode and DB is connected, use real DB
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

    // In development mode or if DB is not connected, use mock users
    if (DEVELOPMENT_MODE || !dbConnected) {
      // Find user in mock users
      const user = mockUsers.find(user => user.email === email);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate authentication token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

      return res.status(200).json({ 
        message: "Login successful", 
        token, 
        user: { 
          id: user._id, 
          email: user.email, 
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        } 
      });
    }

    // If not in development mode and DB is connected, use real DB
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
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

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

// Get nutrition information for a recipe
app.get('/api/nutrition/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching nutrition data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch nutrition data' });
  }
});

// Get nutrition information for multiple recipes
app.post('/api/nutrition/batch', async (req, res) => {
  try {
    const { recipeIds } = req.body;
    
    if (!recipeIds || !Array.isArray(recipeIds) || recipeIds.length === 0) {
      return res.status(400).json({ error: 'Recipe IDs are required' });
    }
    
    // Limit to 10 recipes at a time to avoid overloading the API
    const idsToFetch = recipeIds.slice(0, 10);
    
    // Create an array of promises for parallel requests
    const nutritionPromises = idsToFetch.map(id => 
      axios.get(
        `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json`,
        {
          params: {
            apiKey: process.env.SPOONACULAR_API_KEY
          }
        }
      ).then(response => ({
        id,
        nutrition: response.data
      })).catch(error => ({
        id,
        error: error.response ? error.response.data : error.message
      }))
    );
    
    // Wait for all requests to complete
    const results = await Promise.all(nutritionPromises);
    
    // Format the response
    const nutritionData = {};
    results.forEach(result => {
      nutritionData[result.id] = result.nutrition || { error: result.error };
    });
    
    res.json(nutritionData);
  } catch (error) {
    console.error('Error fetching batch nutrition data:', error.message);
    res.status(500).json({ error: 'Failed to fetch nutrition data' });
  }
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, 'uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter to only accept image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Endpoint to recognize ingredients from an uploaded image
app.post('/api/recognize-ingredients', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });

    const imagePath = req.file.path;

    // Send image to local FastAPI HuggingFace food recognition service
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    const response = await axios.post('http://localhost:8000/predict', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    fs.unlinkSync(imagePath);

    // Debug print what we got from the Python service
    console.log('Recognized ingredients from Python service:', response.data.ingredients);

    // Return recognized ingredients
    res.json({ ingredients: response.data.ingredients });
  } catch (error) {
    console.error('Error recognizing ingredients:', error.message);
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ error: 'Failed to recognize ingredients', details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
