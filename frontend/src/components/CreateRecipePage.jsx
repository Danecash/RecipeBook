// frontend/src/components/CreateRecipePage.jsx

import React, { useState } from 'react';
import { addRecipe } from '../services/api';
import './styles/CreateRecipePage.css';

const CreateRecipePage = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = {
      name: recipeName,
      ingredients,
      instructions,
      category,
      image
    };

    try {
      await addRecipe(recipeData);
      alert('Recipe created successfully!');
      // Clear form
      setRecipeName('');
      setIngredients(['']);
      setInstructions('');
      setCategory('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe.');
    }
  };

  return (
    <div className="create-recipe-container">
      <h2>Create a New Recipe</h2>
      <form onSubmit={handleSubmit}>

        <div>
          <label>Recipe Name:</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Ingredients:</label>
          {ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              required
              style={{ display: 'block', marginBottom: '5px' }}
            />
          ))}
          <button type="button" onClick={addIngredientField}>
            Add Another Ingredient
          </button>
        </div>

        <div>
          <label>Instructions:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            rows="5"
            style={{ width: '100%' }}
          ></textarea>
        </div>

        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div>
              <p>Image Preview:</p>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
            </div>
          )}
        </div>

        <button type="submit">Save Recipe</button>
      </form>
    </div>
  );
};

export default CreateRecipePage;