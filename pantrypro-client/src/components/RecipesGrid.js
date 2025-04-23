import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import '../styles/RecipesGrid.css';

const RecipesGrid = ({ recipes }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  const isRecipeFavorite = (recipeId) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  const handleSaveToFavorites = (recipe) => {
    if (isRecipeFavorite(recipe.id)) {
      setFavorites(favorites.filter(fav => fav.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  if (!recipes || recipes.length === 0) {
    return (
      <div className="no-recipes">
        <p>No recipes found. Try adding more ingredients or adjusting your search.</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-6 bg-gray-800">
      <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">Explore Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSaveToFavorites={handleSaveToFavorites}
            isFavorite={isRecipeFavorite(recipe.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default RecipesGrid;
