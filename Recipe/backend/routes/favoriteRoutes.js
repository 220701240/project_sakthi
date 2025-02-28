import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Favorite from "../models/Favorite.js";

const router = express.Router();

// Add to Favorites
router.post("/add/:id", authMiddleware, async (req, res) => {
  try {
    const favorite = new Favorite({ user: req.user, recipe: req.params.id });
    await favorite.save();
    res.json(favorite);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Remove from Favorites
router.delete("/remove/:id", authMiddleware, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user, recipe: req.params.id });
    res.json({ msg: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get User's Favorites
router.get("/", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user }).populate("recipe");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
