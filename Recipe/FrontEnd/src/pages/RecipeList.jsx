import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const RecipeList = () => {
  const { user, token, favorites, saveToFavorites, removeFromFavorites } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE_URL}/recipes`)
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  // Check if recipe is in favorites
  const isFavorite = (recipeId) => {
    return Array.isArray(favorites) && favorites.some((fav) => fav._id === recipeId);
  };

  // Update Recipe
  const handleUpdate = async (recipeId, updatedFields) => {
    try {
      await axios.put(`${API_BASE_URL}/recipes/update/${recipeId}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes((prev) =>
        prev.map((recipe) => (recipe._id === recipeId ? { ...recipe, ...updatedFields } : recipe))
      );
      alert("Recipe updated successfully!");
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  // Delete Recipe
  const handleDelete = async (recipeId) => {
    try {
      await axios.delete(`${API_BASE_URL}/recipes/delete/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
      alert("Recipe deleted successfully!");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  // Handle Star Rating
  const handleRatingChange = (recipeId, value) => {
    setRating((prev) => ({ ...prev, [recipeId]: value }));
  };

  // Handle Comment Submission
  const handleCommentSubmit = (recipeId) => {
    if (!newComments[recipeId]?.trim()) return;
    setComments((prev) => ({
      ...prev,
      [recipeId]: [...(prev[recipeId] || []), newComments[recipeId]],
    }));
    setNewComments((prev) => ({ ...prev, [recipeId]: "" }));
  };

  return (
    <div className="container-fluid text-white"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg')",
        backgroundSize: "cover",
        minHeight: "100vh",
        padding: "20px",
      }}>
      <h1 className="text-center text-black" style={{ fontStyle: "italic" }}>Recipe List</h1>

      {/* Search Bar */}
      <input type="text" placeholder="Search recipes..." className="form-control w-50 my-2"
        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
        style={{ alignItems: "center", justifyContent: "center", marginLeft: "300px", color: "black" }}
      />

      {/* Recipe List */}
      <div className="container mt-4">
        {recipes.length > 0 ? recipes.map((recipe) => (
          <div key={recipe._id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title text-black">{recipe.title}</h5>
              <p className="card-text text-black"><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
              <p className="card-text text-black"><strong>Instructions:</strong> {recipe.instructions}</p>
              {recipe.image && <img src={recipe.image} alt="Recipe" className="img-fluid rounded" style={{ maxWidth: "200px" }} />}

              {/* Buttons for Recipe Owner */}
              {user && user.id === recipe.addedBy && (
                <>
                  <button className="btn btn-primary mt-2 mx-2"
                    onClick={() => handleUpdate(recipe._id, { title: prompt("Enter new title", recipe.title) })}>
                    Update Recipe
                  </button>
                  <button className="btn btn-danger mt-2 mx-2"
                    onClick={() => handleDelete(recipe._id)}>
                    Delete Recipe
                  </button>
                </>
              )}

              {/* Add/Remove from Favorites */}
              {user ? (
                <>
                  <button className="btn btn-success mt-2 mx-2"
                    onClick={() => {
                      saveToFavorites(recipe);
                      alert("Recipe added to favorites!");
                    }}
                    disabled={isFavorite(recipe._id)}>
                    {isFavorite(recipe._id) ? "Added to Favorites" : "Add to Favorites"}
                  </button>

                  {isFavorite(recipe._id) && (
                    <button className="btn btn-danger mt-2 mx-2"
                      onClick={() => removeFromFavorites(recipe._id)}>
                      Remove from Favorites
                    </button>
                  )}
                </>
              ) : (
                <button className="btn btn-warning mt-2"
                  onClick={() => alert("Please log in to add favorites!")}>
                  Add to Favorites
                </button>
              )}

              {/* 5-Star Rating */}
              <div className="mt-3">
                <strong>Rate this Recipe:</strong>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} style={{ cursor: "pointer", color: star <= (rating[recipe._id] || 0) ? "gold" : "gray" }}
                    onClick={() => handleRatingChange(recipe._id, star)}>
                    ★
                  </span>
                ))}
              </div>

              {/* Comments Section */}
              <div className="mt-3">
                <strong>Comments:</strong>
                <ul>
                  {(comments[recipe._id] || []).map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
                <input type="text" placeholder="Add a comment..." className="form-control"
                  value={newComments[recipe._id] || ""} onChange={(e) => setNewComments((prev) => ({ ...prev, [recipe._id]: e.target.value }))} />
                <button className="btn btn-secondary mt-2" onClick={() => handleCommentSubmit(recipe._id)}>Post</button>
              </div>
            </div>
          </div>
        )) : <p className="text-black">No recipes found.</p>}
      </div>
    </div>
  );
};

export default RecipeList;
