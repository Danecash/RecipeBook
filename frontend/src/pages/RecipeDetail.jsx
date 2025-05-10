// frontend/src/pages/RecipeDetail.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getRecipeById, deleteRecipe, updateRecipe } from '../services/api';
import FavoriteButton from '../components/FavoriteButton';
import Rating from '../components/Rating';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    ingredients: [],
    instructions: [],
    image: null
  });
  const [preview, setPreview] = useState('');
  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    totalRatings: 0
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // First check if we have recipe data in location state
        if (location.state?.recipe) {
          setRecipe(location.state.recipe);
          setImageUrl(getImageUrl(location.state.recipe));
          setLoading(false);
          return;
        }

        // If not, fetch from API
        const response = await getRecipeById(id);
        if (!response.data) {
          throw new Error('Recipe not found');
        }
        setRecipe(response.data);
        setImageUrl(getImageUrl(response.data));
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError(error.message);
        navigate('/favorites', { state: { error: 'Recipe not found' } });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate, location.state]);

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        category: recipe.category,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image: null
      });
      setPreview(imageUrl);
    }
  }, [recipe, imageUrl]);

  const getImageUrl = (recipeData) => {
    if (!recipeData.image) return '/placeholder-recipe.jpg';
    if (recipeData.image.startsWith('http')) return recipeData.image;
    if (recipeData.imageOptimized) {
      return recipeData.imageOptimized.startsWith('http')
        ? recipeData.imageOptimized
        : `http://localhost:3000${recipeData.imageOptimized}`;
    }
    return `http://localhost:3000${recipeData.image}`;
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this recipe?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError('');
      const response = await deleteRecipe(id);
      
      if (response.data.success) {
        alert('Recipe deleted successfully');
        navigate('/', { 
          state: { 
            deletedRecipeId: id 
          } 
        });
      } else {
        setError(response.data.error || 'Failed to delete recipe');
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete recipe');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleAddField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveField = (field, index) => {
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray.splice(index, 1);
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRecipe = { ...formData };
      console.log('Updated Recipe Data:', updatedRecipe); // Debugging log

      // Handle image upload if a new image is selected
      if (formData.image) {
        const formDataObj = new FormData();
        formDataObj.append('image', formData.image);
        console.log('Uploading image...'); // Debugging log
        const imageResponse = await uploadImage(formDataObj);
        updatedRecipe.image = imageResponse.data.imagePath;
      }

      console.log('Sending update request...'); // Debugging log
      const response = await updateRecipe(id, updatedRecipe);
      console.log('Update response:', response); // Debugging log

      alert('Recipe updated successfully');
      setIsEditing(false);
      setRecipe(updatedRecipe);
    } catch (error) {
      console.error('Error updating recipe:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update recipe');
    }
  };

  const handleRatingChange = (data) => {
    setRatingData({
      averageRating: data.averageRating,
      totalRatings: data.totalRatings
    });
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="error">Recipe not found</div>;

  if (isEditing) {
    return (
      <div className="edit-recipe-page">
        <h1>Edit Recipe</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group">
            <label>Recipe Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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
              <div key={index} className="array-input-group">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('ingredients', index)}
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('ingredients')}
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
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('instructions', index)}
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('instructions')}
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

          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="recipe-header">
        <h1>{recipe.name}</h1>
        <div className="recipe-actions">
          <FavoriteButton recipeId={recipe._id} />
          {user && user._id === recipe.author?._id && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="delete-button"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="recipe-image">
        <img src={imageUrl} alt={recipe.name} />
      </div>

      <div className="recipe-rating">
        <Rating 
          recipeId={recipe._id} 
          initialRating={recipe.averageRating}
          onRatingChange={handleRatingChange}
        />
        <div className="rating-stats">
          <span>Average Rating: {ratingData.averageRating.toFixed(1)}</span>
          <span>Total Ratings: {ratingData.totalRatings}</span>
        </div>
      </div>

      <div className="recipe-category">
        <span>Category: {recipe.category}</span>
      </div>

      <div className="recipe-content">
        <div className="ingredients">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="instructions">
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;