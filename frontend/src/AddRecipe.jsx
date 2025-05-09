// frontend/src/AddRecipe.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRecipe } from '../services/api';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Appetizer',
    ingredients: [''],
    instructions: [''],
    image: null
  });
  const [preview, setPreview] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('category', formData.category);
      formPayload.append('ingredients', JSON.stringify(formData.ingredients));
      formPayload.append('instructions', JSON.stringify(formData.instructions));
      formPayload.append('image', formData.image);

      await addRecipe(formPayload);
      navigate('/');
    } catch (error) {
      console.error("Error adding recipe:", error);
      setError(error.response?.data?.error || 'Failed to add recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-recipe-page">
      <div className="add-recipe-container">
        <h1>Add New Recipe</h1>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group">
            <label>Recipe Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter recipe name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category*</label>
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
            <label>Ingredients*</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="array-field">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  required
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField('ingredients', index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
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
            <label>Instructions*</label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="array-field">
                <textarea
                  value={instruction}
                  onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  required
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField('instructions', index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
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
            <label>Recipe Image*</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <div className="image-preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;