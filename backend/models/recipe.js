// backend/models/recipe.js

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const path = require('path');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Recipe name is required"],
    trim: true,
    maxlength: [100, "Recipe name cannot exceed 100 characters"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: ['Appetizer', 'Beverages', 'Desserts', 'Meal'],
      message: '{VALUE} is not a valid category'
    }
  },
  ingredients: {
    type: [String],
    required: [true, "Ingredients are required"],
    validate: {
      validator: v => Array.isArray(v) && v.length > 0 && v.every(i => i.trim().length > 0),
      message: "At least one valid ingredient is required"
    }
  },
  instructions: {
    type: [String],
    required: [true, "Instructions are required"],
    validate: {
      validator: v => Array.isArray(v) && v.length > 0 && v.every(i => i.trim().length > 0),
      message: "At least one valid instruction is required"
    }
  },
  image: {
    type: String,
    required: [true, "Image path is required"],
    validate: {
      validator: v => v.startsWith('/backend/uploads/'),
      message: "Image path must be in /backend/uploads/"
    }
  },
  imageOptimized: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return v.startsWith('/backend/uploads/') || v.startsWith('http');
      },
      message: "Optimized image path must be in /backend/uploads/ or a valid URL"
    }
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }],
  favoriteCount: {
    type: Number,
    default: 0,
    min: 0
  },
  reviews: [{
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      if (ret.image && !ret.image.startsWith('http')) {
        ret.image = `${process.env.BASE_URL || 'http://localhost:3000'}${ret.image}`;
      }
      if (ret.imageOptimized && !ret.imageOptimized.startsWith('http')) {
        ret.imageOptimized = `${process.env.BASE_URL || 'http://localhost:3000'}${ret.imageOptimized}`;
      }
      delete ret.__v;
      delete ret._id;
      ret.id = doc._id.toString();
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Auto-create optimized image path
recipeSchema.pre('save', function(next) {
  if (this.isModified('image') && !this.imageOptimized) {
    this.imageOptimized = this.image;
  }
  this.updatedAt = Date.now();
  next();
});

// Update favorite count when favorites array changes
recipeSchema.pre('save', function(next) {
  if (this.isModified('favorites')) {
    this.favoriteCount = this.favorites.length;
  }
  next();
});

// Text index for searching
recipeSchema.index({
  name: 'text',
  category: 'text',
  ingredients: 'text'
}, {
  weights: {
    name: 5,
    ingredients: 3,
    category: 1
  }
});

// Indexes for performance
recipeSchema.index({ favorites: 1 });
recipeSchema.index({ favoriteCount: -1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ favoriteCount: -1, averageRating: -1, reviews: -1 });

// New indexes as requested
recipeSchema.index({ ingredients: 'text' });         // Full-text search on ingredients
recipeSchema.index({ ingredients: 1 });              // Array field index for faster querying

// Virtual for average rating
recipeSchema.virtual('averageRating').get(function() {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

recipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Recipe", recipeSchema);
