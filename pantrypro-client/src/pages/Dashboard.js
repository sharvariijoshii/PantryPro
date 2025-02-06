import { useContext, useState } from "react";
import AuthContext from "../AuthContext";
import { getRecipes } from "../api";

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes(ingredients.split(","), token);
      setRecipes(data);
    } catch (error) {
      alert(error.error || "Failed to fetch recipes");
    }
  };

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <h3>Find Recipes</h3>
      <input type="text" placeholder="Enter ingredients (comma separated)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
      <button onClick={fetchRecipes}>Search</button>

      {recipes.length > 0 && (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
