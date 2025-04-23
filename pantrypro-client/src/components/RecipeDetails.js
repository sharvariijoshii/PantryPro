import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First try to find the recipe in localStorage
    const findRecipeInStorage = () => {
      // Check in favorites
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${user.email}`)) || [];
        const foundRecipe = favorites.find(r => r.id === parseInt(id) || r.id === id);
        if (foundRecipe) return foundRecipe;
      }

      // Check in searched recipes
      const searchedRecipes = JSON.parse(localStorage.getItem('searchedRecipes')) || [];
      return searchedRecipes.find(r => r.id === parseInt(id) || r.id === id);
    };

    const recipeData = findRecipeInStorage();
    if (recipeData) {
      setRecipe(recipeData);
      setLoading(false);
    } else {
      // If not found in localStorage, could fetch from API here
      // For now, just redirect back to recipes page
      navigate('/recipes');
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className={`recipe-details-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="loading-spinner">Loading recipe details...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className={`recipe-details-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="recipe-not-found">
          <h2>Recipe Not Found</h2>
          <p>Sorry, we couldn't find the recipe you're looking for.</p>
          <button className="back-button" onClick={() => navigate('/recipes')}>
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`recipe-details-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="recipe-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="recipe-title">{recipe.title}</h1>
      </div>

      <div className="recipe-details-content">
        <div className="recipe-image-container">
          <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        </div>

        <div className="recipe-info">
          <div className="recipe-meta">
            {recipe.readyInMinutes && (
              <span className="recipe-time">
                <i className="time-icon">⏱️</i> {recipe.readyInMinutes} mins
              </span>
            )}
            {recipe.servings && (
              <span className="recipe-servings">
                <i className="servings-icon">👥</i> {recipe.servings} servings
              </span>
            )}
          </div>

          <div className="recipe-tags">
            {recipe.vegetarian && <span className="recipe-tag vegetarian">Vegetarian</span>}
            {recipe.vegan && <span className="recipe-tag vegan">Vegan</span>}
            {recipe.glutenFree && <span className="recipe-tag gluten-free">Gluten Free</span>}
            {recipe.dairyFree && <span className="recipe-tag dairy-free">Dairy Free</span>}
          </div>

          <div className="recipe-ingredients">
            <h2>Ingredients:</h2>
            <div className="ingredients-lists">
              {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
                <div className="ingredients-section">
                  <h3>Ingredients You Have:</h3>
                  <ul className="used-ingredients-list">
                    {recipe.usedIngredients.map((ingredient, index) => (
                      <li key={`used-${index}`} className="ingredient-item used">
                        <span className="ingredient-icon">✓</span> {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                <div className="ingredients-section">
                  <h3>Ingredients You Need:</h3>
                  <ul className="missed-ingredients-list">
                    {recipe.missedIngredients.map((ingredient, index) => (
                      <li key={`missed-${index}`} className="ingredient-item missed">
                        <span className="ingredient-icon">+</span> {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="recipe-instructions">
            <h2>Instructions:</h2>
            {recipe.instructions ? (
              <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            ) : (
              <p>Mix all ingredients in a glass bowl and slowly heat in the microwave until piping hot. Salt and freshly ground black pepper to taste.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
