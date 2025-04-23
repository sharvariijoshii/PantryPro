import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [favorites, setFavorites] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const storedFavorites = localStorage.getItem(`favorites_${userData.email}`);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    }
    return [];
  });
  
  const [recipes, setRecipes] = useState([]); // Ensure recipes are cleared properly
  const [loading, setLoading] = useState(false);

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setRecipes([]); // Clear recipes on logout
    localStorage.removeItem("user");
    localStorage.removeItem("searchedRecipes");
    sessionStorage.removeItem("searchedRecipes");
    
    setTimeout(() => {
        console.log("Recipes after logout:", recipes);
    }, 100); // Delaying to ensure state updates
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    setRecipes([]); // Reset recipes on login
    sessionStorage.removeItem("searchedRecipes");

    const storedFavorites = localStorage.getItem(`favorites_${userData.email}`);
    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);

    setTimeout(() => {
        console.log("Recipes after login:", recipes);
    }, 100); // Delaying to ensure state updates
  };

  const addFavorite = (recipe) => {
    if (!user) return; // Ensure a user is logged in

    const updatedFavorites = [...favorites, recipe];
    setFavorites(updatedFavorites);
  };

  const removeFavorite = (recipeId) => {
    if (!user) return;

    const updatedFavorites = favorites.filter((recipe) => recipe.id !== recipeId);
    setFavorites(updatedFavorites);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, favorites, addFavorite, removeFavorite, recipes, setRecipes }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
