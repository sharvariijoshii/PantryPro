import React from "react";

const RecipesGrid = () => {
  return (
    <section className="py-16 px-6 bg-gray-800">
      <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">Explore Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
          >
            <img
              src={`https://source.unsplash.com/400x300/?food&sig=${index}`}
              alt="Recipe"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">Delicious Recipe {index + 1}</h3>
              <p className="text-gray-400 text-sm">Time: 20 mins | Difficulty: Easy</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecipesGrid;
