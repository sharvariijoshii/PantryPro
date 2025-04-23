import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../styles/MealPlanner.css';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const MealPlanner = () => {
  const navigate = useNavigate();
  const { favorites } = useContext(AuthContext);
  const [mealPlan, setMealPlan] = useState(() => {
    const savedMealPlan = localStorage.getItem('mealPlan');
    return savedMealPlan ? JSON.parse(savedMealPlan) : createEmptyMealPlan();
  });
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showingShoppingList, setShowingShoppingList] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);
  const [draggedRecipe, setDraggedRecipe] = useState(null);

  // Update savedRecipes when favorites change
  useEffect(() => {
    setSavedRecipes(favorites || []);
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  function createEmptyMealPlan() {
    const emptyPlan = {};
    DAYS_OF_WEEK.forEach(day => {
      emptyPlan[day] = {};
      MEAL_TYPES.forEach(mealType => {
        emptyPlan[day][mealType] = null;
      });
    });
    return emptyPlan;
  }

  function handleDragStart(recipe) {
    setDraggedRecipe(recipe);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, day, mealType) {
    e.preventDefault();
    if (draggedRecipe) {
      const updatedMealPlan = { ...mealPlan };
      updatedMealPlan[day][mealType] = draggedRecipe;
      setMealPlan(updatedMealPlan);
      setDraggedRecipe(null);
    }
  }

  function removeMeal(day, mealType) {
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan[day][mealType] = null;
    setMealPlan(updatedMealPlan);
  }

  function clearMealPlan() {
    if (window.confirm('Are you sure you want to clear the entire meal plan?')) {
      setMealPlan(createEmptyMealPlan());
    }
  }

  function generateShoppingList() {
    // Collect all ingredients from planned meals
    const allIngredients = [];
    
    Object.values(mealPlan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(meal => {
        if (meal && meal.missedIngredients) {
          meal.missedIngredients.forEach(ingredient => {
            // Check if ingredient already exists in the list
            const existingIngredient = allIngredients.find(item => 
              item.name.toLowerCase() === ingredient.toLowerCase()
            );
            
            if (existingIngredient) {
              existingIngredient.count += 1;
            } else {
              allIngredients.push({
                name: ingredient,
                count: 1,
                checked: false
              });
            }
          });
        }
      });
    });
    
    // Sort alphabetically
    allIngredients.sort((a, b) => a.name.localeCompare(b.name));
    
    setShoppingList(allIngredients);
    setShowingShoppingList(true);
  }

  function toggleIngredientChecked(index) {
    const updatedList = [...shoppingList];
    updatedList[index].checked = !updatedList[index].checked;
    setShoppingList(updatedList);
  }

  function closeShoppingList() {
    setShowingShoppingList(false);
  }

  return (
    <div className="meal-planner">
      <div className="meal-planner-header">
        <h2>Weekly Meal Planner</h2>
      </div>

      <div className="meal-planner-actions">
        <button onClick={generateShoppingList} className="action-btn generate-list-btn">
          Generate Shopping List
        </button>
        <button onClick={clearMealPlan} className="action-btn clear-plan-btn">
          Clear Meal Plan
        </button>
      </div>

      <div className="meal-planner-container">
        <div className="meal-planner-sidebar">
          <h3>Your Saved Recipes</h3>
          <p className="drag-instructions">Drag recipes to the meal plan</p>
          
          {savedRecipes.length === 0 ? (
            <div className="no-saved-recipes">
              <p>You don't have any saved recipes yet.</p>
              <button 
                onClick={() => navigate('/recipes')}
                className="find-recipes-btn"
              >
                Find Recipes
              </button>
            </div>
          ) : (
            <div className="saved-recipes-list">
              {savedRecipes.map(recipe => (
                <div 
                  key={recipe.id}
                  className="draggable-recipe"
                  draggable
                  onDragStart={() => handleDragStart(recipe)}
                >
                  <div className="recipe-drag-thumb" style={{ backgroundImage: `url(${recipe.image})` }}></div>
                  <div className="recipe-drag-info">
                    <h4>{recipe.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="meal-plan-grid">
          <div className="meal-plan-header">
            <div className="meal-type-header"></div>
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="day-header">
                <span className="day-name">{day}</span>
              </div>
            ))}
          </div>

          <div className="meal-plan-body">
            {MEAL_TYPES.map(mealType => (
              <div key={mealType} className="meal-row">
                <div className="meal-type">{mealType}</div>
                
                {DAYS_OF_WEEK.map(day => (
                  <div 
                    key={`${day}-${mealType}`}
                    className="meal-cell"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, mealType)}
                  >
                    {mealPlan[day][mealType] ? (
                      <div className="planned-meal">
                        <div 
                          className="meal-image" 
                          style={{ backgroundImage: `url(${mealPlan[day][mealType].image})` }}
                        ></div>
                        <div className="meal-info">
                          <h4>{mealPlan[day][mealType].title}</h4>
                          <button 
                            className="remove-meal-btn"
                            onClick={() => removeMeal(day, mealType)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-meal">
                        <span>Drop recipe here</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showingShoppingList && (
        <div className="shopping-list-modal">
          <div className="shopping-list-content">
            <div className="shopping-list-header">
              <h3>Shopping List</h3>
              <button onClick={closeShoppingList} className="close-btn">×</button>
            </div>
            
            {shoppingList.length === 0 ? (
              <div className="empty-shopping-list">
                <p>No ingredients needed for your meal plan.</p>
              </div>
            ) : (
              <>
                <div className="shopping-list-items">
                  {shoppingList.map((item, index) => (
                    <div 
                      key={index} 
                      className={`shopping-item ${item.checked ? 'checked' : ''}`}
                      onClick={() => toggleIngredientChecked(index)}
                    >
                      <span className="checkbox">
                        {item.checked ? '✓' : ''}
                      </span>
                      <span className="item-name">{item.name}</span>
                      {item.count > 1 && (
                        <span className="item-count">({item.count})</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="shopping-list-actions">
                  <button 
                    onClick={() => {
                      const text = shoppingList.map(item => 
                        `${item.checked ? '[x]' : '[ ]'} ${item.name}${item.count > 1 ? ` (${item.count})` : ''}`
                      ).join('\n');
                      
                      navigator.clipboard.writeText(text)
                        .then(() => alert('Shopping list copied to clipboard!'))
                        .catch(err => console.error('Failed to copy: ', err));
                    }}
                    className="copy-list-btn"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
