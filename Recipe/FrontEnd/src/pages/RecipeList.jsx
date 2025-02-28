import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api"; // Replace with your actual API URL

const RecipeList = ({ username }) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterMealType, setFilterMealType] = useState("all");
  const [filterTimeRequired, setFilterTimeRequired] = useState("all");
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [updatedRecipe, setUpdatedRecipe] = useState({});
  const [reviewInputs, setReviewInputs] = useState({});

  // Fetch recipes from API
  useEffect(() => {
    axios.get(`${API_BASE_URL}/recipes`)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => console.error("Error fetching recipes:", error));

    if (user) {
      axios.get(`${API_BASE_URL}/favorites/${user.username}`)
        .then((response) => setFavorites(response.data))
        .catch((error) => console.error("Error fetching favorites:", error));
    }
  }, [user]);

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterCategory === "all" || recipe.category === filterCategory) &&
    (filterDifficulty === "all" || recipe.difficulty === filterDifficulty) &&
    (filterMealType === "all" || recipe.mealType.toLowerCase() === filterMealType.toLowerCase()) &&
    (filterTimeRequired === "all" || recipe.timeRequired.replace(/\s/g, '') === filterTimeRequired.replace(/\s/g, ''))
  );

  // Save recipe to favorites in database
  const saveToFavorites = (recipe) => {
    if (!user || !user.username) {
      console.error("User not logged in");
      return;
    }
    axios.post(`${API_BASE_URL}/favorites`, { username: user.username, recipeId: recipe.id })
      .then(() => setFavorites([...favorites, recipe]))
      .catch((error) => console.error("Error adding to favorites:", error));
  };
  
  const removeFromFavorites = (recipeId) => {
    if (!user || !user.username) {
      console.error("User not logged in");
      return;
    }
    axios.delete(`${API_BASE_URL}/favorites/${user.username}/${recipeId}`)
      .then(() => setFavorites(favorites.filter((recipe) => recipe.id !== recipeId)))
      .catch((error) => console.error("Error removing from favorites:", error));
  };
  

  // Delete recipe from database
  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/recipes/${id}`)
      .then(() => {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
        alert("Recipe deleted!");
      })
      .catch((error) => console.error("Error deleting recipe:", error));
  };

  // Edit recipe
  const handleEdit = (recipe) => {
    setEditingRecipe(recipe.id);
    setUpdatedRecipe({ ...recipe });
  };

  // Update recipe in database
  const handleUpdate = () => {
    axios.put(`${API_BASE_URL}/recipes/${editingRecipe}`, updatedRecipe)
      .then(() => {
        setRecipes(recipes.map((recipe) =>
          recipe.id === editingRecipe ? { ...recipe, ...updatedRecipe } : recipe
        ));
        setEditingRecipe(null);
        alert("Recipe updated!");
      })
      .catch((error) => console.error("Error updating recipe:", error));
  };

  // Handle Rating
  const handleRatingChange = (recipeId, rating) => {
    axios.put(`${API_BASE_URL}/recipes/${recipeId}/rating`, { rating })
      .then(() => {
        setRecipes(recipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, rating } : recipe
        ));
      })
      .catch((error) => console.error("Error updating rating:", error));
  };

  // Submit review
  const handleReviewSubmit = (recipeId) => {
    const review = reviewInputs[recipeId]?.trim();
    if (!review) return;

    axios.post(`${API_BASE_URL}/recipes/${recipeId}/reviews`, { review })
      .then(() => {
        setRecipes(recipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, reviews: [...(recipe.reviews || []), review] } : recipe
        ));
        setReviewInputs({ ...reviewInputs, [recipeId]: "" });
      })
      .catch((error) => console.error("Error submitting review:", error));
  };

  return (
    <div className="container-fluid text-white" style={{ backgroundImage: "url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg')", backgroundSize: "cover", minHeight: "100vh", padding: "20px" }}>
      <h1 className="text-center text-black" style={{ fontStyle: "italic" }}>Recipe List</h1>

      {/* Search Bar */}
      <input type="text" placeholder="Search recipes..." className="form-control w-50 my-2"
        value={searchQuery} style={{ alignItems: "center", justifyContent: "center", marginLeft: "300px", color: "black" }}
        onChange={(e) => setSearchQuery(e.target.value)} />

      {/* Recipe List */}
      <div className="container mt-4">
        {filteredRecipes.length > 0 ? filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="card mb-3">
            <div className="card-body">
              {editingRecipe === recipe.id ? (
                <>
                  <input type="text" className="form-control my-2" value={updatedRecipe.title} onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, title: e.target.value })} />
                  <button className="btn btn-success mx-2" onClick={handleUpdate}>Save</button>
                  <button className="btn btn-secondary mx-2" onClick={() => setEditingRecipe(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h5 className="card-title">{recipe.title}</h5>
                  <button className="btn btn-primary mx-2" onClick={() => handleEdit(recipe)}>Edit</button>
                  <button className="btn btn-danger mx-2" onClick={() => handleDelete(recipe.id)}>Delete</button>
                  {favorites.find(fav => fav.id === recipe.id) ? (
                    <button className="btn btn-warning mx-2" onClick={() => removeFromFavorites(recipe.id)}>Remove from Favorites</button>
                  ) : (
                    <button className="btn btn-success mx-2" onClick={() => saveToFavorites(recipe)}>Add to Favorites</button>
                  )}
                </>
              )}
            </div>
          </div>
        )) : <p className="text-black">No recipes found.</p>}
      </div>
    </div>
  );
};

export default RecipeList;
