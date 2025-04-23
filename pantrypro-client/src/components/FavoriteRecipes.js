import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/FavoriteRecipes.css';

const FavoriteRecipes = () => {
  const { favorites, removeFavorite } = useAuthContext();
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleViewRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  const handleRemoveFavorite = (e, id) => {
    e.stopPropagation();
    removeFavorite(id);
  };

  return (
    <div className={`favorites-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1 className={`favorites-header ${darkMode ? 'dark-mode-header' : ''}`}>❤️ Favorite Recipes</h1>
      <p className={`favorites-subheader ${darkMode ? 'dark-mode-subheader' : ''}`}>Your saved recipes, ready whenever you are!</p>

      {favorites.length === 0 ? (
        <div className={`no-favorites ${darkMode ? 'dark-mode-no-favorites' : ''}`}>
          <h3 className={`no-favorites-title ${darkMode ? 'dark-mode-no-favorites-title' : ''}`}>No favorites yet!</h3>
          <p className={`no-favorites-description ${darkMode ? 'dark-mode-no-favorites-description' : ''}`}>Start adding recipes to your favorites to see them here.</p>
          <button 
            className={`find-recipes-button ${darkMode ? 'dark-mode-find-recipes-button' : ''}`}
            onClick={() => navigate('/')}
          >
            Find Recipes
          </button>
        </div>
      ) : (
        <div className={`favorites-grid ${darkMode ? 'dark-mode-grid' : ''}`}>
          {favorites.map((recipe) => (
            <div 
              key={recipe.id} 
              className={`favorite-card ${darkMode ? 'dark-mode-card' : ''}`}
              onClick={() => handleViewRecipe(recipe.id)}
            >
              <div className={`favorite-image-container ${darkMode ? 'dark-mode-image-container' : ''}`}>
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className={`favorite-image ${darkMode ? 'dark-mode-image' : ''}`}
                />
              </div>
              <div className={`favorite-content ${darkMode ? 'dark-mode-content' : ''}`}>
                <h3 className={`favorite-title ${darkMode ? 'dark-mode-title' : ''}`}>{recipe.title}</h3>
                
                {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
                  <p className={`used-ingredients ${darkMode ? 'dark-mode-used' : ''}`}>Used: {recipe.usedIngredients.join(", ")}</p>
                )}
                
                {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                  <p className={`missed-ingredients ${darkMode ? 'dark-mode-missed' : ''}`}>Missed: {recipe.missedIngredients.join(", ")}</p>
                )}
                
                <div className={`favorite-buttons ${darkMode ? 'dark-mode-buttons' : ''}`}>
                  <button 
                    className={`remove-button ${darkMode ? 'dark-mode-remove' : ''}`}
                    onClick={(e) => handleRemoveFavorite(e, recipe.id)}
                  >
                    Remove
                  </button>
                  <button 
                    className={`view-button ${darkMode ? 'dark-mode-view' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewRecipe(recipe.id);
                    }}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteRecipes;
