import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./FavoriteRecipes.css";

const FavoriteRecipes = () => {
  const { user, favorites, removeFavorite } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.email}`);
      setUserFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    }
  }, [user, favorites]);

  const handleBack = () => {
    navigate("/recipes"); // Adjust the route as needed
  };

  return (
    <div className="favorite-recipes-container">
      <h2 className="favorite-recipes-heading">❤️ Favorite Recipes</h2>
      {userFavorites.length === 0 ? (
        <p className="no-favorites-text">No favorite recipes yet.</p>
      ) : (
        <div className="favorite-recipes-grid">
          {userFavorites.map((recipe) => (
            <div key={recipe.id} className="favorite-recipe-card">
              {/* Image First */}
              <img src={recipe.image} alt={recipe.title} className="favorite-recipe-image" />
              
              {/* Recipe Title Below Image */}
              <h3 className="favorite-recipe-title">{recipe.title}</h3>
              
              {/* Used & Missed Ingredients */}
              {recipe.usedIngredients && recipe.missedIngredients && (
                <div className="ingredients-info">
                  <p className="used-ingredients">Used: {recipe.usedIngredients.join(", ")}</p>
                  <p className="missed-ingredients">Missed: {recipe.missedIngredients.join(", ")}</p>
                </div>
              )}
              
              {/* Remove Button */}
              <button
                onClick={() => {
                  removeFavorite(recipe.id);
                  setUserFavorites(userFavorites.filter(r => r.id !== recipe.id));
                }}
                className="remove-favorite-button"
              >
                Remove ❌
              </button>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleBack} className="back-button">
        Back to Recipes
      </button>
    </div>
  );
};

export default FavoriteRecipes;
