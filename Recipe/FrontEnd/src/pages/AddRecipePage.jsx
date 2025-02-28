import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
  const { user, token } = useAuth(); // Ensure token is available
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("main course");
  const [difficulty, setDifficulty] = useState("easy");
  const [mealType, setMealType] = useState("vegan");
  const [timeRequired, setTimeRequired] = useState("less than 15 mins");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You need to log in to add a recipe!");
      return;
    }

    const newRecipe = {
      title,
      ingredients: ingredients.split(",").map((item) => item.trim()), // Ensure array format
      instructions,
      image,
      category,
      difficulty,
      mealType,
      timeRequired,
      addedBy: user.username,
    };

    try {
      const response = await fetch("http://localhost:5000/api/recipes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in header
        },
        body: JSON.stringify(newRecipe),
      });

      const data = await response.json();
      console.log("Response Status:", response.status, "Response Data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to add recipe");
      }

      alert("Recipe added successfully!");
      navigate("/recipes"); // Redirect to recipes page
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert(error.message || "Failed to add recipe. Please try again.");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/4108723/pexels-photo-4108723.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="container mt-4">
        <h2
          style={{ textAlign: "center", color: "black", fontStyle: "italic" }}
        >
          Add Recipe
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="form-control mb-2"
            placeholder="Ingredients (comma-separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
          <textarea
            className="form-control mb-2"
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <select
            className="form-control mb-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="main course">Main Course</option>
            <option value="dessert">Dessert</option>
            <option value="appetizer">Appetizer</option>
          </select>

          <select
            className="form-control mb-2"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="form-control mb-2"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
          </select>

          <select
            className="form-control mb-2"
            value={timeRequired}
            onChange={(e) => setTimeRequired(e.target.value)}
          >
            <option value="less than 15 mins">Less than 15 mins</option>
            <option value="15-30 mins">15-30 mins</option>
            <option value="above 30 mins">Above 30 mins</option>
          </select>

          <button type="submit" className="btn btn-primary w-100">
            Add Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
