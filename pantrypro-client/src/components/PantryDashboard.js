import React, { useState, useEffect } from 'react';
import '../styles/PantryDashboard.css';

const CATEGORIES = [
  { id: 'vegetables', name: 'Vegetables', icon: '🥦' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'dairy', name: 'Dairy', icon: '🧀' },
  { id: 'grains', name: 'Grains & Pasta', icon: '🍚' },
  { id: 'protein', name: 'Protein', icon: '🥩' },
  { id: 'spices', name: 'Spices', icon: '🌶️' },
  { id: 'canned', name: 'Canned Goods', icon: '🥫' },
  { id: 'frozen', name: 'Frozen', icon: '❄️' },
  { id: 'other', name: 'Other', icon: '🍯' }
];

const PantryDashboard = ({ onIngredientsSelected }) => {
  const [pantryItems, setPantryItems] = useState(() => {
    const savedItems = localStorage.getItem('pantryItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'vegetables',
    quantity: 1,
    unit: 'item',
    expiryDate: ''
  });
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
  }, [pantryItems]);
  
  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    
    const today = new Date();
    const expiryDate = newItem.expiryDate ? new Date(newItem.expiryDate) : null;
    
    setPantryItems([
      ...pantryItems,
      {
        id: Date.now().toString(),
        ...newItem,
        addedDate: today.toISOString().split('T')[0],
        expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : null
      }
    ]);
    
    setNewItem({
      name: '',
      category: 'vegetables',
      quantity: 1,
      unit: 'item',
      expiryDate: ''
    });
  };
  
  const removeItem = (id) => {
    setPantryItems(pantryItems.filter(item => item.id !== id));
  };
  
  const updateItemQuantity = (id, change) => {
    setPantryItems(pantryItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };
  
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return 'no-expiry';
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 3) return 'expiring-soon';
    return 'fresh';
  };
  
  const filteredItems = pantryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleUseInRecipe = () => {
    const selectedIngredients = pantryItems.map(item => item.name);
    if (onIngredientsSelected && selectedIngredients.length > 0) {
      onIngredientsSelected(selectedIngredients);
    }
  };
  
  return (
    <div className="pantry-dashboard">
      <h2 className="pantry-title">My Pantry</h2>
      
      <div className="pantry-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filter">
          <button 
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="add-item-form-container">
        <form onSubmit={addItem} className="add-item-form">
          <input
            type="text"
            placeholder="Ingredient name"
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            className="form-input"
            required
          />
          
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            className="form-select"
          >
            {CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          
          <div className="quantity-input">
            <input
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
              className="form-input quantity"
            />
            
            <select
              value={newItem.unit}
              onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
              className="form-select unit"
            >
              <option value="item">Item(s)</option>
              <option value="g">Grams</option>
              <option value="kg">Kilograms</option>
              <option value="ml">Milliliters</option>
              <option value="l">Liters</option>
              <option value="cup">Cup(s)</option>
              <option value="tbsp">Tablespoon(s)</option>
              <option value="tsp">Teaspoon(s)</option>
            </select>
          </div>
          
          <div className="expiry-input">
            <label>Expiry Date:</label>
            <input
              type="date"
              value={newItem.expiryDate}
              onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
              className="form-input date"
            />
          </div>
          
          <button type="submit" className="add-btn">Add to Pantry</button>
        </form>
      </div>
      
      <div className="pantry-items-container">
        {filteredItems.length === 0 ? (
          <div className="empty-pantry">
            <p>Your pantry is empty. Add some ingredients to get started!</p>
          </div>
        ) : (
          <div className="pantry-items-grid">
            {filteredItems.map(item => {
              const expiryStatus = getExpiryStatus(item.expiryDate);
              const categoryInfo = CATEGORIES.find(cat => cat.id === item.category);
              
              return (
                <div key={item.id} className={`pantry-item ${expiryStatus}`}>
                  <div className="item-header">
                    <span className="item-category">{categoryInfo?.icon}</span>
                    <span className="item-name">{item.name}</span>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>×</button>
                  </div>
                  
                  <div className="item-details">
                    <div className="item-quantity">
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateItemQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span>{item.quantity} {item.unit}</span>
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateItemQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    {item.expiryDate && (
                      <div className="item-expiry">
                        <span className={`expiry-indicator ${expiryStatus}`}></span>
                        <span className="expiry-date">
                          {expiryStatus === 'expired' ? 'Expired' : `Expires: ${item.expiryDate}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="pantry-actions">
        <button 
          className="use-in-recipe-btn"
          onClick={handleUseInRecipe}
          disabled={pantryItems.length === 0}
        >
          Find Recipes Using My Pantry
        </button>
      </div>
    </div>
  );
};

export default PantryDashboard;
