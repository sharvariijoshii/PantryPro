import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RecipeCard.css';

const RecipeCard = ({ recipe, onSaveToFavorites, isFavorite }) => {
  const navigate = useNavigate();
  
  const handleSaveToFavorites = (e) => {
    e.stopPropagation(); // Prevent card navigation when clicking the favorite button
    onSaveToFavorites(recipe);
  };
  
  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent default when clicking the view details button
    navigate(`/recipe/${recipe.id}`);
  };
  
  return (
    <div className="recipe-card" onClick={handleViewDetails}>
      <div className="recipe-image-container">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="recipe-image"
        />
      </div>
      
      <div className="recipe-card-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        
        {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
          <p className="used-ingredients">Used: {recipe.usedIngredients.join(", ")}</p>
        )}
        
        {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
          <p className="missed-ingredients">Missed: {recipe.missedIngredients.join(", ")}</p>
        )}
        
        <div className="button-container">
          <button 
            className={isFavorite ? "remove-button" : "favorite-button"}
            onClick={handleSaveToFavorites}
          >
            {isFavorite ? 'Remove' : '❤️ Add to Favorites'}
          </button>
          <button className="view-button" onClick={handleViewDetails}>
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
