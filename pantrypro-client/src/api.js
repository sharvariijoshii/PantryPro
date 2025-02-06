import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api"; // Adjust if deployed

// Register New User
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

// Login User & Get Token
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

// Fetch Recipes (Example Protected API)
export const getRecipes = async (ingredients, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/recipes`,
      { ingredients },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch recipes";
  }
};
