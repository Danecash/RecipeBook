import React, { useState } from 'react';
import { addRecipe } from './services/api';

function AddRecipe() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    ingredients: '',
    instructions: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recipeData = {
      ...formData,
      ingredients: formData.ingredients.split(',').map((item) => item.trim()),
      instructions: formData.instructions.split('.').map((item) => item.trim()),
    };
    addRecipe(recipeData)
      .then(() => alert('Recipe added successfully!'))
      .catch((error) => console.error('Error adding recipe:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Recipe</h2>
      <input
        type="text"
        name="name"
        placeholder="Recipe Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
      />
      <textarea
        name="ingredients"
        placeholder="Ingredients (comma-separated)"
        value={formData.ingredients}
        onChange={handleChange}
        required
      />
      <textarea
        name="instructions"
        placeholder="Instructions (period-separated)"
        value={formData.instructions}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Recipe</button>
    </form>
  );
}

export default AddRecipe;