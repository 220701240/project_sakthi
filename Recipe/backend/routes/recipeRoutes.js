import express from "express";
import Recipe from "../models/Recipe.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Recipe
router.post("/add", async (req, res) => {
  try {
      const newRecipe = new Recipe(req.body);
      await newRecipe.save();
      res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (error) {
      console.error("Error adding recipe:", error);import express from "express";
import Recipe from "../models/Recipe.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Create Recipe (Only logged-in users can add)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      userId: req.user.id, // ✅ Link recipe to the logged-in user
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ message: "Failed to add recipe" });
  }
});

// ✅ Get All Recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("userId", "name email");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Recipe (Only the creator can update)
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    if (!recipe.userId || recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete Recipe (Only the creator can delete)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    if (!recipe.userId || recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await recipe.deleteOne();
    res.json({ msg: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

      res.status(500).json({ message: "Failed to add recipe" });
  }
});

// Get All Recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("userId", "name");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Recipe
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    if (recipe.userId.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Recipe
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    if (recipe.userId.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });

    await recipe.deleteOne();
    res.json({ msg: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
