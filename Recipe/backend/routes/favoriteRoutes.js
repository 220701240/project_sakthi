import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Favorite from "../models/Favorite.js";
import Recipe from "../models/Recipe.js"; // Import Recipe model to fetch full recipe details

const router = express.Router();

// Add Recipe to Favorites (Ensure all recipe details are stored)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ msg: "Recipe ID is required" });
    }

    const existingFavorite = await Favorite.findOne({ user: req.user.id, recipe: recipeId });

    if (existingFavorite) {
      return res.status(400).json({ msg: "Recipe already in favorites" });
    }

    const recipe = await Recipe.findById(recipeId); // Fetch full recipe details
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    const newFavorite = new Favorite({
      user: req.user.id,
      recipe: recipeId, // Store only ID reference
    });

    await newFavorite.save();
    res.json({ msg: "Recipe added to favorites successfully", favorite: newFavorite });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Remove Recipe from Favorites
router.delete("/remove/:id", authMiddleware, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user.id, recipe: req.params.id });
    res.json({ msg: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get User's Favorites (Populate recipe details)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate("recipe");
    res.json(favorites.map(fav => fav.recipe)); // Send only the recipe details
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
