// frontend/components/RecipeForm.jsx

import { useState, useEffect } from 'react';

const RecipeForm = ({ recipe, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    category: recipe?.category || 'Appetizer',
    ingredients: recipe?.ingredients || [''],
    instructions: recipe?.instructions || [''],
    image: null
  });
  const [preview, setPreview] = useState(recipe?.image || '');

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        category: recipe.category,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image: null
      });
      setPreview(recipe.image);
    }
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleAddField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleRemoveField = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <div className="form-group">
        <label>Recipe Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="Appetizer">Appetizer</option>
          <option value="Beverages">Beverages</option>
          <option value="Desserts">Desserts</option>
          <option value="Meal">Meal</option>
        </select>
      </div>

      <div className="form-group">
        <label>Ingredients</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="array-field">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveField('ingredients', index)}
              className="remove-btn"
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField('ingredients')}
          className="add-btn"
        >
          + Add Ingredient
        </button>
      </div>

      <div className="form-group">
        <label>Instructions</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="array-field">
            <textarea
              value={instruction}
              onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveField('instructions', index)}
              className="remove-btn"
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField('instructions')}
          className="add-btn"
        >
          + Add Step
        </button>
      </div>

      <div className="form-group">
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;