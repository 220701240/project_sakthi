import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Review from "../models/Review.js";

const router = express.Router();

// Add Review
router.post("/add/:id", authMiddleware, async (req, res) => {
  try {
    const review = new Review({ user: req.user, recipe: req.params.id, ...req.body });
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get Reviews for Recipe
router.get("/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.id }).populate("user", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
