import React, { useState, useEffect } from 'react';
import '../styles/DietaryFilters.css';

const DietaryFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('dietaryFilters');
    return savedFilters ? JSON.parse(savedFilters) : {
      diets: [],
      intolerances: [],
      maxReadyTime: 60,
      includeIngredients: [],
      excludeIngredients: []
    };
  });
  
  const [expandedSection, setExpandedSection] = useState(null);
  const [newIngredient, setNewIngredient] = useState('');
  const [newExcludedIngredient, setNewExcludedIngredient] = useState('');
  
  useEffect(() => {
    localStorage.setItem('dietaryFilters', JSON.stringify(filters));
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);
  
  const dietOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten Free' },
    { id: 'ketogenic', label: 'Ketogenic' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'pescetarian', label: 'Pescetarian' },
    { id: 'whole30', label: 'Whole30' }
  ];
  
  const intoleranceOptions = [
    { id: 'dairy', label: 'Dairy' },
    { id: 'egg', label: 'Egg' },
    { id: 'gluten', label: 'Gluten' },
    { id: 'grain', label: 'Grain' },
    { id: 'peanut', label: 'Peanut' },
    { id: 'seafood', label: 'Seafood' },
    { id: 'sesame', label: 'Sesame' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'soy', label: 'Soy' },
    { id: 'sulfite', label: 'Sulfite' },
    { id: 'tree-nut', label: 'Tree Nut' },
    { id: 'wheat', label: 'Wheat' }
  ];
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  const handleDietChange = (dietId) => {
    setFilters(prev => {
      const newDiets = prev.diets.includes(dietId)
        ? prev.diets.filter(id => id !== dietId)
        : [...prev.diets, dietId];
      
      return { ...prev, diets: newDiets };
    });
  };
  
  const handleIntoleranceChange = (intoleranceId) => {
    setFilters(prev => {
      const newIntolerances = prev.intolerances.includes(intoleranceId)
        ? prev.intolerances.filter(id => id !== intoleranceId)
        : [...prev.intolerances, intoleranceId];
      
      return { ...prev, intolerances: newIntolerances };
    });
  };
  
  const handleTimeChange = (e) => {
    setFilters(prev => ({
      ...prev,
      maxReadyTime: parseInt(e.target.value) || 60
    }));
  };
  
  const addIngredient = (e) => {
    e.preventDefault();
    if (!newIngredient.trim()) return;
    
    setFilters(prev => ({
      ...prev,
      includeIngredients: [...prev.includeIngredients, newIngredient.trim()]
    }));
    
    setNewIngredient('');
  };
  
  const removeIngredient = (ingredient) => {
    setFilters(prev => ({
      ...prev,
      includeIngredients: prev.includeIngredients.filter(item => item !== ingredient)
    }));
  };
  
  const addExcludedIngredient = (e) => {
    e.preventDefault();
    if (!newExcludedIngredient.trim()) return;
    
    setFilters(prev => ({
      ...prev,
      excludeIngredients: [...prev.excludeIngredients, newExcludedIngredient.trim()]
    }));
    
    setNewExcludedIngredient('');
  };
  
  const removeExcludedIngredient = (ingredient) => {
    setFilters(prev => ({
      ...prev,
      excludeIngredients: prev.excludeIngredients.filter(item => item !== ingredient)
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      diets: [],
      intolerances: [],
      maxReadyTime: 60,
      includeIngredients: [],
      excludeIngredients: []
    });
  };
  
  return (
    <div className="dietary-filters">
      <div className="filters-header">
        <h3>Dietary Preferences</h3>
        <button onClick={resetFilters} className="reset-filters-btn">Reset All</button>
      </div>
      
      <div className="filter-sections">
        {/* Diets Section */}
        <div className="filter-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('diets')}
          >
            <h4>Diet Types</h4>
            <span className="toggle-icon">{expandedSection === 'diets' ? '−' : '+'}</span>
          </div>
          
          {expandedSection === 'diets' && (
            <div className="section-content">
              <div className="checkbox-grid">
                {dietOptions.map(diet => (
                  <label key={diet.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.diets.includes(diet.id)}
                      onChange={() => handleDietChange(diet.id)}
                    />
                    <span>{diet.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Intolerances Section */}
        <div className="filter-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('intolerances')}
          >
            <h4>Food Intolerances</h4>
            <span className="toggle-icon">{expandedSection === 'intolerances' ? '−' : '+'}</span>
          </div>
          
          {expandedSection === 'intolerances' && (
            <div className="section-content">
              <div className="checkbox-grid">
                {intoleranceOptions.map(intolerance => (
                  <label key={intolerance.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.intolerances.includes(intolerance.id)}
                      onChange={() => handleIntoleranceChange(intolerance.id)}
                    />
                    <span>{intolerance.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Max Ready Time Section */}
        <div className="filter-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('time')}
          >
            <h4>Max Preparation Time</h4>
            <span className="toggle-icon">{expandedSection === 'time' ? '−' : '+'}</span>
          </div>
          
          {expandedSection === 'time' && (
            <div className="section-content">
              <div className="time-slider">
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={filters.maxReadyTime}
                  onChange={handleTimeChange}
                  className="slider"
                />
                <div className="time-display">
                  <span>{filters.maxReadyTime} minutes</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Include Ingredients Section */}
        <div className="filter-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('include')}
          >
            <h4>Must Include Ingredients</h4>
            <span className="toggle-icon">{expandedSection === 'include' ? '−' : '+'}</span>
          </div>
          
          {expandedSection === 'include' && (
            <div className="section-content">
              <form onSubmit={addIngredient} className="ingredient-form">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add ingredient..."
                  className="ingredient-input"
                />
                <button type="submit" className="add-btn">Add</button>
              </form>
              
              {filters.includeIngredients.length > 0 && (
                <div className="ingredients-list">
                  {filters.includeIngredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-tag">
                      <span>{ingredient}</span>
                      <button 
                        onClick={() => removeIngredient(ingredient)}
                        className="remove-tag-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Exclude Ingredients Section */}
        <div className="filter-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('exclude')}
          >
            <h4>Exclude Ingredients</h4>
            <span className="toggle-icon">{expandedSection === 'exclude' ? '−' : '+'}</span>
          </div>
          
          {expandedSection === 'exclude' && (
            <div className="section-content">
              <form onSubmit={addExcludedIngredient} className="ingredient-form">
                <input
                  type="text"
                  value={newExcludedIngredient}
                  onChange={(e) => setNewExcludedIngredient(e.target.value)}
                  placeholder="Add ingredient to exclude..."
                  className="ingredient-input"
                />
                <button type="submit" className="add-btn">Add</button>
              </form>
              
              {filters.excludeIngredients.length > 0 && (
                <div className="ingredients-list">
                  {filters.excludeIngredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-tag exclude">
                      <span>{ingredient}</span>
                      <button 
                        onClick={() => removeExcludedIngredient(ingredient)}
                        className="remove-tag-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="active-filters">
        <h4>Active Filters:</h4>
        <div className="filter-tags">
          {filters.diets.map(diet => {
            const dietOption = dietOptions.find(option => option.id === diet);
            return (
              <div key={diet} className="filter-tag diet">
                <span>{dietOption?.label || diet}</span>
                <button 
                  onClick={() => handleDietChange(diet)}
                  className="remove-tag-btn"
                >
                  ×
                </button>
              </div>
            );
          })}
          
          {filters.intolerances.map(intolerance => {
            const intoleranceOption = intoleranceOptions.find(option => option.id === intolerance);
            return (
              <div key={intolerance} className="filter-tag intolerance">
                <span>No {intoleranceOption?.label || intolerance}</span>
                <button 
                  onClick={() => handleIntoleranceChange(intolerance)}
                  className="remove-tag-btn"
                >
                  ×
                </button>
              </div>
            );
          })}
          
          {filters.maxReadyTime !== 60 && (
            <div className="filter-tag time">
              <span>Under {filters.maxReadyTime} min</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, maxReadyTime: 60 }))}
                className="remove-tag-btn"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietaryFilters;
