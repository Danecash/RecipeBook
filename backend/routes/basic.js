// backend/routes/basic.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { protect } = require('../middlewares/auth');
const upload = require("../utils/upload");
const validateRecipeData = require("../middlewares/validateRecipe");
const { formatRecipeImage, serverError } = require("../utils/helpers");
const Recipe = require("../models/recipe");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongoose').Types;

// GET all recipes
router.get("/recipes", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const [recipes, total] = await Promise.all([
      Recipe.find()
        .sort({ createdAt: -1 }) // Add sorting
        .skip(skip)
        .limit(limit)
        .select('+imageOptimized')
        .lean()
        .transform(docs => docs.map(formatRecipeImage)),
      Recipe.countDocuments()
    ]);

    res.json({
      data: recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("GET /recipes error:", error);
    res.status(500).json(serverError(error));
  }
});

// GET single recipe
router.get("/recipes/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }
    const recipe = await Recipe.findById(req.params.id)
      .select('+imageOptimized')
      .lean()
      .transform(doc => doc ? formatRecipeImage(doc) : null);

    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    console.error(`GET /recipes/${req.params.id} error:`, error);
    res.status(500).json(serverError(error));
  }
});

// SEARCH recipes
router.get("/search/:query", async (req, res) => {
  try {
    const recipes = await Recipe.find({
      $or: [
        { name: { $regex: req.params.query, $options: "i" } },
        { ingredients: { $regex: req.params.query, $options: "i" } }
      ]
    })
    .select('+imageOptimized')
    .lean()
    .transform(docs => docs.map(formatRecipeImage));
    res.json(recipes);
  } catch (error) {
    console.error("GET /search error:", error);
    res.status(500).json(serverError(error));
  }
});

// Update the GET recipes by category route
router.get("/category/:category", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Exact match for category (case insensitive)
    const category = new RegExp(`^${req.params.category}$`, 'i');

    const [recipes, total] = await Promise.all([
      Recipe.find({ category })
        .sort({ _id: 1 }) // Sort by _id for consistent pagination
        .skip(skip)
        .limit(limit)
        .select('+imageOptimized')
        .lean(),
      Recipe.countDocuments({ category })
    ]);

    res.json({
      data: recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("GET /category error:", error);
    res.status(500).json(serverError(error));
  }
});


// CREATE recipe
router.post("/recipes", upload.single('image'), validateRecipeData, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Recipe image is required" });

    const { name, category } = req.body;
    const { ingredients, instructions } = req.parsedData;
    const categoryDir = category.toLowerCase().replace(/\s+/g, '-');
    const imagePath = `/backend/uploads/${categoryDir}/${req.file.filename}`;

    const newRecipe = new Recipe({
      name: name.trim(),
      category: category.trim(),
      ingredients,
      instructions,
      image: imagePath,
      imageOptimized: `${imagePath}?w=800&h=600&fit=cover`
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json({
      success: true,
      recipe: formatRecipeImage(savedRecipe.toObject())
    });

  } catch (error) {
    console.error("POST /recipes error:", error);
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    res.status(500).json(serverError(error));
  }
});

// UPDATE recipe

router.put("/recipes/:id", upload.single('image'), validateRecipeData, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const updateData = {
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      ingredients: req.parsedData.ingredients,
      instructions: req.parsedData.instructions
    };

    if (req.file) {
      const category = req.body.category.toLowerCase().replace(/\s+/g, '-');
      updateData.image = `/backend/uploads/${category}/${req.file.filename}`;
      updateData.imageOptimized = `${updateData.image}?w=800&h=600&fit=cover`;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id, updateData, { new: true, runValidators: true }
    ).lean();

    if (!updatedRecipe) return res.status(404).json({ error: "Recipe not found" });

    res.json(formatRecipeImage(updatedRecipe));
  } catch (error) {
    console.error(`PUT /recipes/${req.params.id} error:`, error);
    res.status(500).json(serverError(error));
  }
});

// OPTIMIZE images (Admin)
router.get("/optimize-images", async (req, res) => {
  try {
    const recipes = await Recipe.find({
      image: { $exists: true },
      imageOptimized: { $exists: false }
    });

    const updates = recipes.map(recipe =>
      Recipe.updateOne(
        { _id: recipe._id },
        { $set: { imageOptimized: `${recipe.image}?w=800&h=600&fit=cover` } }
      )
    );

    await Promise.all(updates);
    res.json({
      success: true,
      message: `${updates.length} images optimized`
    });
  } catch (error) {
    console.error("GET /optimize-images error:", error);
    res.status(500).json(serverError(error));
  }
});

// DELETE recipe
router.delete("/recipes/:id", async (req, res) => {
  console.log('DELETE request for:', req.params.id);
  try {
    if (!ObjectId.isValid(req.params.id)) {
      console.log('Invalid ID format:', req.params.id);
      return res.status(400).json({ 
        success: false,
        error: "Invalid recipe ID format" 
      });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ 
        success: false,
        error: "Recipe not found" 
      });
    }

    // Store image paths before deletion
    const imagePaths = [];
    if (recipe.image && !recipe.image.startsWith('http')) {
      imagePaths.push(path.join(__dirname, '..', recipe.image));
    }
    if (recipe.imageOptimized && !recipe.imageOptimized.startsWith('http')) {
      imagePaths.push(path.join(__dirname, '..', recipe.imageOptimized));
    }

    // Delete from database
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ 
        success: false,
        error: "Recipe deletion failed" 
      });
    }

    // Delete associated image files
    const deletePromises = imagePaths.map(imagePath => {
      return new Promise((resolve) => {
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.log(`Image not found: ${imagePath}`);
            return resolve();
          }
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Error deleting image file ${imagePath}:`, err);
              return resolve();
            }
            console.log(`Successfully deleted image: ${imagePath}`);
            resolve();
          });
        });
      });
    });

    await Promise.all(deletePromises);

    res.json({ 
      success: true, 
      message: "Recipe and associated images deleted successfully",
      deletedRecipe
    });

  } catch (error) {
    console.error(`DELETE /recipes/${req.params.id} error:`, error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        stack: error.stack
      })
    });
  }
});

// Add this new route for ratings
router.post('/recipes/:id/rate', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if user already rated this recipe
    const existingReviewIndex = recipe.reviews.findIndex(
      review => review.author.toString() === req.user._id.toString()
    );

    if (existingReviewIndex >= 0) {
      // Update existing review
      recipe.reviews[existingReviewIndex].rating = rating;
      recipe.reviews[existingReviewIndex].comment = comment || '';
    } else {
      // Add new review
      recipe.reviews.push({
        rating,
        comment: comment || '',
        author: req.user._id
      });
    }

    await recipe.save();
    
    // Calculate average rating
    const avgRating = recipe.reviews.reduce((sum, review) => sum + review.rating, 0) / recipe.reviews.length;

    res.json({
      success: true,
      reviews: recipe.reviews,
      averageRating: avgRating
    });
  } catch (error) {
    console.error(`POST /recipes/${req.params.id}/rate error:`, error);
    res.status(500).json(serverError(error));
  }
});

// Toggle favorite
router.post('/recipes/:id/favorite', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const userId = req.user._id;
    const user = await User.findById(userId);
    
    const recipeIndex = recipe.favorites.indexOf(userId);
    const userIndex = user.favorites.indexOf(recipe._id);

    if (recipeIndex === -1) {
      // Add to favorites
      recipe.favorites.push(userId);
      recipe.favoriteCount += 1;
      user.favorites.push(recipe._id);
    } else {
      // Remove from favorites
      recipe.favorites.splice(recipeIndex, 1);
      recipe.favoriteCount -= 1;
      user.favorites.splice(userIndex, 1);
    }

    await Promise.all([recipe.save(), user.save()]);
    
    res.json({ 
      success: true, 
      favoriteCount: recipe.favoriteCount,
      isFavorited: recipeIndex === -1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get favorites
router.get('/favorites', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Changed to 10 recipes per page
    const skip = (page - 1) * limit;

    // First get the user with populated favorites (limited to current page)
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        options: {
          skip,
          limit,
          sort: { createdAt: -1 }
        }
      })
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Then count total favorites (using aggregation for better performance)
    const totalCount = await User.aggregate([
      { $match: { _id: user._id } },
      { $project: { count: { $size: "$favorites" } } }
    ]);

    const total = totalCount[0]?.count || 0;

    res.json({
      success: true,
      data: user.favorites || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch favorites",
      details: error.message
    });
  }
});

// Get popular recipes
// Popular recipes endpoint
router.get('/recipes/popular', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.aggregate([
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              0
            ]
          },
          reviewCount: { $size: "$reviews" }
        }
      },
      { $sort: { favoriteCount: -1, averageRating: -1, reviewCount: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          category: 1,
          ingredients: 1,
          instructions: 1,
          image: 1,
          imageOptimized: 1,
          favoriteCount: 1,
          averageRating: 1,
          reviewCount: 1,
          favorites: 1
        }
      }
    ]);

    const total = await Recipe.countDocuments();

    res.json({
      success: true,
      data: recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("Error fetching popular recipes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch popular recipes",
      details: error.message
    });
  }
});

module.exports = router;

