const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../schema/recipe");

const { ObjectId } = mongoose.Types;

// GET all recipes (WORKS)
router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// GET a single recipe by ID (WORKS)
router.get("/recipes/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found!" });

    res.json(recipe);
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).json({ error: "Error retrieving recipe" });
  }
});

// Search recipes by name (WORKS)
router.get("/search/:query", async (req, res) => {
  try {
    const recipes = await Recipe.find({ name: { $regex: req.params.query, $options: "i" } });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

  // Get recipes by category (WORKS)
router.get("/category/:category", async (req, res) => {
  try {
    const recipes = await Recipe.find({ category: { $regex: req.params.category, $options: "i" } });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get favorite recipes (STILL ON PROGRESS)
router.get("/recipes/favorites", async (req, res) => {
  try {
    const favorites = await Recipe.find({ favorite: true });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorite recipes" });
  }
});

// Paginate recipes (IN PROGRESS)
router.get("/recipes/paginate", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const recipes = await Recipe.find()
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch paginated recipes" });
  }
});

// Top 10 popular ingredients (STILL ON PROGRESS)
router.get("/recipes/popular-ingredients", async (req, res) => {
  try {
    const ingredients = await Recipe.aggregate([
      { $unwind: "$ingredients" },
      { $group: { _id: "$ingredients", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch popular ingredients" });
  }
});

// Find by ingredient list (STILL ON PROGRESS)
router.get("/recipes/ingredients", async (req, res) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ error: "Ingredients query parameter is required" });
    }

    const ingredientArray = ingredients.split(",");
    const recipes = await Recipe.find({ ingredients: { $all: ingredientArray } });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes by ingredients" });
  }
});

// Recently added recipes (WORKS)
router.get("/recipes/recent/:days", async (req, res) => {
  try {
    const { days } = req.params;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const recipes = await Recipe.find({ createdAt: { $gte: cutoffDate } });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent recipes" });
  }
});

  // POST a new recipe (WORKS)
router.post("/recipes", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Failed to add recipe" });
  }
});

// Add a review (WORKS)
router.post("/recipes/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }


    recipe.reviews.push({ rating, comment, date: new Date() })
    await recipe.save();

    res.json({ message: "Review added successfully", recipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

// PUT - Update a recipe (WORKS)
router.put("/recipes/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe updated successfully", updatedRecipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// DELETE - Remove a recipe (WORKS)
router.delete("/recipes/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

// PATCH - Toggle favorite (WORKS)
router.patch("/:id/favorite", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    recipe.favorite = !recipe.favorite;
    await recipe.save();

    res.json({ message: `Recipe favorite status: ${recipe.favorite}`, recipe });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

