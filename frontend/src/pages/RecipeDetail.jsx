// frontend/src/pages/RecipeDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  getRecipeById, 
  deleteRecipe,
  rateRecipe,
  updateRecipe
} from '../services/api';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import RecipeForm from '../components/RecipeForm';
import { toast } from 'react-toastify';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [isSavingReview, setIsSavingReview] = useState(false);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await getRecipeById(id);
      if (!response.data) throw new Error('Recipe not found');
      
      setRecipe(response.data);
      
      if (user) {
        const userReview = response.data.reviews?.find(
          r => r.author._id === user._id
        );
        if (userReview) {
          setUserRating(userReview.rating);
          setUserReview(userReview.comment || '');
        }
      }
    } catch (error) {
      setError(error.message);
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      setIsDeleting(true);
      await deleteRecipe(id);
      toast.success('Recipe deleted successfully!');
      navigate('/');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to delete recipe');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveReview = async () => {
    if (!userRating) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setIsSavingReview(true);
      const response = await rateRecipe(id, { 
        rating: userRating, 
        comment: userReview 
      });
      
      setRecipe(prev => ({
        ...prev,
        reviews: response.data.reviews,
        averageRating: response.data.averageRating
      }));
      
      toast.success('Review saved successfully!');
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review');
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await updateRecipe(id, formData);
      setRecipe(response.data);
      setIsEditing(false);
      toast.success('Recipe updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update recipe');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-recipe.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="error">Recipe not found</div>;

  return (
    <div className="recipe-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="recipe-actions">
        <FavoriteButton 
          recipeId={id}
          initialCount={recipe.favoriteCount || 0}
          isInitiallyFavorited={recipe.favorites?.includes(user?._id) || false}
          onFavoriteChange={fetchRecipe}
        />
        
        {user && (
          <>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="edit-button"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Recipe'}
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="delete-button"
            >
              {isDeleting ? 'Deleting...' : 'Delete Recipe'}
            </button>
          </>
        )}
      </div>

      {isEditing ? (
        <RecipeForm 
          recipe={recipe} 
          onSubmit={handleUpdate} 
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="recipe-header">
            <h1>{recipe.name}</h1>
            <span className={`category-badge ${recipe.category.toLowerCase()}`}>
              {recipe.category}
            </span>
          </div>

          <div className="image-container">
            <img
              src={getImageUrl(recipe.imageOptimized || recipe.image)}
              alt={recipe.name}
              onError={(e) => {
                e.target.src = '/placeholder-recipe.jpg';
              }}
              className="detail-image"
            />
          </div>

          <div className="rating-section">
            <h3>
              Rating: {recipe.averageRating || 'Not rated yet'} 
              ({recipe.reviews?.length || 0} reviews)
            </h3>
            <StarRating 
              rating={userRating} 
              onRate={setUserRating} 
              editable={!!user}
            />
            {user && (
              <div className="review-form">
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Leave a review (optional)"
                />
                <button
                  onClick={handleSaveReview}
                  disabled={isSavingReview}
                  className="save-review-btn"
                >
                  {isSavingReview ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            )}
          </div>

          <div className="recipe-content">
            <section className="ingredients">
              <h2>Ingredients</h2>
              <ul>
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            </section>

            <section className="instructions">
              <h2>Instructions</h2>
              <ol>
                {recipe.instructions.map((instruction, i) => (
                  <li key={i}>{instruction}</li>
                ))}
              </ol>
            </section>
          </div>

          {recipe.reviews?.length > 0 && (
            <div className="reviews-section">
              <h3>Reviews</h3>
              {recipe.reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <span className="review-author">
                      {review.author?.name || 'Anonymous'}
                    </span>
                    <StarRating rating={review.rating} editable={false} />
                  </div>
                  {review.comment && (
                    <p className="review-comment">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipeDetail;