const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2'); // Add this for pagination

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
    },
    index: true // Add index for better ingredient search
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

// Add text index for better searching (supports your existing search endpoints)
recipeSchema.index({
  name: 'text',
  category: 'text',
  'ingredients': 'text'
});

// Enable pagination plugin (required for paginate endpoint)
recipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Recipe", recipeSchema);