import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 pt-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">♥️ Favorite Recipes</h1>
      <p className="text-gray-600 mb-6 text-center text-lg max-w-lg">
        Your saved recipes, ready whenever you are!
      </p>

      {/* No Favorites Message */}
      {userFavorites.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">No favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {userFavorites.map((recipe) => (
            <div key={recipe.id} className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
              {/* Recipe Image */}
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-40 object-cover rounded-lg"
              />
              
              {/* Recipe Title */}
              <h3 className="text-lg font-bold text-gray-700 mt-2 text-center">{recipe.title}</h3>
              
              {/* Used & Missed Ingredients */}
              {recipe.usedIngredients && recipe.missedIngredients && (
                <div className="mt-2">
                  <p className="text-sm text-green-600 font-semibold">Used: {recipe.usedIngredients.join(", ")}</p>
                  <p className="text-sm text-red-600 font-semibold">Missed: {recipe.missedIngredients.join(", ")}</p>
                </div>
              )}

              {/* Remove Button */}
              <button
                onClick={() => {
                  removeFavorite(recipe.id);
                  setUserFavorites(userFavorites.filter((r) => r.id !== recipe.id));
                }}
                className="w-full bg-red-500 text-white font-semibold py-2 mt-3 rounded-lg hover:bg-red-600 transition"
              >
                ♡ Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mt-6 bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        ⬅ Back to Recipes
      </button>
    </div>
  );
};

export default FavoriteRecipes;
