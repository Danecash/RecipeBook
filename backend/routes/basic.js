//backend/routes/basic.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const upload = require("../utils/upload");
const validateRecipeData = require("../middlewares/validateRecipe");
const { formatRecipeImage, serverError } = require("../utils/helpers");
const Recipe = require("../models/recipe");

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
        .select('+imageOptimized')
        .skip(skip)
        .limit(limit)
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

// GET recipes by category
router.get("/category/:category", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [recipes, total] = await Promise.all([
      Recipe.find({ category: { $regex: req.params.category, $options: "i" } })
        .select('+imageOptimized')
        .skip(skip)
        .limit(limit)
        .lean()
        .transform(docs => docs.map(formatRecipeImage)),
      Recipe.countDocuments({ category: { $regex: req.params.category, $options: "i" } })
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

// backend/routes/basic.js
// Update the category endpoint:
router.get("/category/:category", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [recipes, total] = await Promise.all([
      Recipe.find({ category: { $regex: req.params.category, $options: "i" } })
        .skip(skip)
        .limit(limit),
      Recipe.countDocuments({ category: { $regex: req.params.category, $options: "i" } })
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

// backend/routes/basic.js
// Add these routes:

// Toggle favorite
// Update the favorite route to use authenticated user
router.post('/recipes/:id/favorite', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const userId = req.user._id; // From authentication middleware
    const index = recipe.favorites.indexOf(userId);

    if (index === -1) {
      recipe.favorites.push(userId);
      recipe.favoriteCount += 1;
    } else {
      recipe.favorites.splice(index, 1);
      recipe.favoriteCount -= 1;
    }

    await recipe.save();
    res.json({ 
      success: true, 
      favoriteCount: recipe.favoriteCount,
      isFavorited: index === -1
    });
  } catch (error) {
    res.status(500).json(serverError(error));
  }
});

// Get favorites route (you already have this, just verify)
router.get('/favorites', async (req, res) => {
  try {
    const userId = req.user._id; // From authentication middleware
    const recipes = await Recipe.find({ favorites: userId });
    res.json(recipes);
  } catch (error) {
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
  console.log('DELETE request for:', req.params.id); // Debug log
  try {
    if (!ObjectId.isValid(req.params.id)) {
      console.log('Invalid ID format:', req.params.id); // Debug log
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

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

