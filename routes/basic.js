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

// Get favorite recipes (WORKS)
router.get("/favorites", async (req, res) => { // Changed from "/recipes/favorites"
  try {
    const favorites = await Recipe.find({ favorite: true });
    res.json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch favorite recipes",
      details: error.message 
    });
  }
});

// Paginate recipes (WORKS)
router.get("/paginate", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    // Validate and sanitize inputs
    const options = {
      page: Math.max(1, parseInt(page)),
      limit: Math.min(50, Math.max(1, parseInt(limit))), // Max 50 items per page
      sort: sort // Sorts by newest first by default
    };

    // If you need to filter by category or other fields:
    const query = {};
    if (req.query.category) {
      query.category = { $regex: req.query.category, $options: 'i' };
    }

    const result = await Recipe.paginate(query, options);

    res.json({
      success: true,
      data: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
        itemsPerPage: result.limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch paginated recipes",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Top 10 popular ingredients (WORKS)
router.get("/popular-ingredients", async (req, res) => { // Changed from "/recipes/popular-ingredients"
  try {
    const ingredients = await Recipe.aggregate([
      { $unwind: "$ingredients" },
      { $group: { 
          _id: "$ingredients", 
          count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: ingredients.map(item => ({
        ingredient: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch popular ingredients",
      details: error.message
    });
  }
});

// Find by ingredient list (STILL ON PROGRESS)
router.get("/search/ingredients", async (req, res) => {
  try {
    const allRecipes = await Recipe.find({});
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const searchTerms = q.toLowerCase().split(',').map(t => t.trim());

    const results = allRecipes.filter(recipe => 
      searchTerms.every(term =>
        recipe.ingredients.some(ing => 
          ing.toLowerCase().includes(term)
        )
      )
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Search failed", details: error.message });
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
      // Validate required fields first
      const { name, category, ingredients, instructions } = req.body;
      
      // Manual validation
      if (!name) return res.status(400).json({ error: "Recipe name is required" });
      if (!category) return res.status(400).json({ error: "Category is required" });
      if (!ingredients || !ingredients.length) {
        return res.status(400).json({ error: "At least one ingredient is required" });
      }
      if (!instructions || !instructions.length) {
        return res.status(400).json({ error: "At least one instruction is required" });
      }
  
      // Create and save recipe
      const newRecipe = new Recipe({
        name,
        category,
        ingredients,
        instructions,
        // Include optional fields if provided
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.prepTime && { prepTime: req.body.prepTime }),
        ...(req.body.cookTime && { cookTime: req.body.cookTime }),
        ...(req.body.servings && { servings: req.body.servings })
      });
  
      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
      
    } catch (error) {
      console.error("Error adding recipe:", error);
      
      // Enhanced error response
      const errorResponse = {
        error: "Failed to add recipe",
        details: error.message
      };
      
      if (error.name === 'ValidationError') {
        errorResponse.validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
      }
      
      res.status(500).json(errorResponse);
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

