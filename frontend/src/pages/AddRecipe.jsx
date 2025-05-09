// frontend/src/pages/AddRecipe.jsx

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
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Recipe name is required';
    if (!formData.category) newErrors.category = 'Category is required';

    // Validate ingredients
    formData.ingredients.forEach((ing, index) => {
      if (!ing.trim()) newErrors[`ingredient-${index}`] = 'Ingredient cannot be empty';
    });

    // Validate instructions
    formData.instructions.forEach((inst, index) => {
      if (!inst.trim()) newErrors[`instruction-${index}`] = 'Instruction cannot be empty';
    });

    if (!formData.image) newErrors.image = 'Recipe image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    try {
      await addRecipe(formData);
      alert('Recipe added successfully!');
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="add-recipe-page">
      <h1>Add New Recipe</h1>

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label>Recipe Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Category</label><h1></h1>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="Appetizer">Appetizer</option>
            <option value="Beverages">Beverages</option>
            <option value="Desserts">Desserts</option>
            <option value="Meal">Meal</option>
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="array-input-group">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                className={errors[`ingredient-${index}`] ? 'error' : ''}
              />
              <button
                type="button"
                onClick={() => handleRemoveField('ingredients', index)}
                className="remove-btn"
              >
                -
              </button>
              {errors[`ingredient-${index}`] && (
                <span className="error-message">{errors[`ingredient-${index}`]}</span>
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
          <label>Instructions</label>
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="array-input-group">
              <textarea
                value={instruction}
                onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                className={errors[`instruction-${index}`] ? 'error' : ''}
              />
              <button
                type="button"
                onClick={() => handleRemoveField('instructions', index)}
                className="remove-btn"
              >
                -
              </button>
              {errors[`instruction-${index}`] && (
                <span className="error-message">{errors[`instruction-${index}`]}</span>
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
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={errors.image ? 'error' : ''}
          />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
          {errors.image && <span className="error-message">{errors.image}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? 'Saving...' : 'Save Recipe'}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;