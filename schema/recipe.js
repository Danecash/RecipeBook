const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Recipe name is required"] 
  },
  category: { 
    type: String, 
    required: [true, "Category is required"] 
  },
  ingredients: { 
    type: [String], 
    required: [true, "Ingredients are required"],
    validate: {
      validator: v => v.length > 0,
      message: "At least one ingredient is required"
    }
  },
  instructions: { 
    type: [String], 
    required: [true, "Instructions are required"],
    validate: {
      validator: v => v.length > 0,
      message: "At least one instruction is required"
    }
  },
  favorite: { 
    type: Boolean, 
    default: false 
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
  timestamps: true 
});

module.exports = mongoose.model("Recipe", recipeSchema);