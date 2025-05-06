// backend/models/recipe.js
// Recipe model with enhanced validation, pagination, and image handling

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const path = require('path');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Recipe name is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ['Appetizer', 'Beverages', 'Desserts', 'Meal']
  },
  ingredients: {
    type: [String],
    required: [true, "Ingredients are required"],
    validate: {
      validator: v => v.length > 0 && v.every(i => i.trim().length > 0),
      message: "At least one valid ingredient is required"
    }
  },
  instructions: {
    type: [String],
    required: [true, "Instructions are required"],
    validate: {
      validator: v => v.length > 0 && v.every(i => i.trim().length > 0),
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
    type: String
  },
  favorite: {
    type: Boolean,
    default: false
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  favoriteCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Add full URL when converting to JSON
      if (ret.image && !ret.image.startsWith('http')) {
        ret.image = `http://localhost:3000${ret.image}`;
      }
      if (ret.imageOptimized && !ret.imageOptimized.startsWith('http')) {
        ret.imageOptimized = `http://localhost:3000${ret.imageOptimized}`;
      }
      return ret;
    }
  }
});

// Auto-create optimized image path
recipeSchema.pre('save', function(next) {
  if (this.isModified('image')) {
    this.imageOptimized = this.image; // Remove ?w=400... if not using
  }
  next();
});

// Text index for searching
recipeSchema.index({
  name: 'text',
  category: 'text',
  ingredients: 'text'
});

recipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Recipe", recipeSchema);