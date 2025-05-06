import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, deleteRecipe } from '../services/api';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getRecipeById(id);
        setRecipe(response.data);
        
        // Handle image URL
        if (response.data.image) {
          if (response.data.image.startsWith('http')) {
            setImageUrl(response.data.image);
          } else if (response.data.imageOptimized) {
            setImageUrl(
              response.data.imageOptimized.startsWith('http')
                ? response.data.imageOptimized
                : `http://localhost:3000${response.data.imageOptimized}`
            );
          } else {
            setImageUrl(`http://localhost:3000${response.data.image}`);
          }
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this recipe?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError('');
      const response = await deleteRecipe(id);
      
      if (response.data.success) {
        navigate('/', { 
          state: { 
            message: response.data.message || 'Recipe deleted successfully',
            deletedRecipe: response.data.deletedRecipe 
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

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="recipe-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Recipes
      </button>

      <div className="recipe-actions">
        <FavoriteButton 
          recipeId={id}
          initialCount={recipe.favoriteCount || 0}
          isInitiallyFavorited={recipe.favorites?.includes(user?._id) || false}
        />
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="delete-button"
        >
          {isDeleting ? 'Deleting...' : 'Delete Recipe'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="recipe-header">
        <h1>{recipe.name}</h1>
        <span className={`category-badge ${recipe.category.toLowerCase()}`}>
          {recipe.category}
        </span>
      </div>

      <div className="image-container">
        <img
          src={imageUrl || '/placeholder-recipe.jpg'}
          alt={recipe.name}
          onError={(e) => {
            e.target.src = '/placeholder-recipe.jpg';
          }}
          className="detail-image"
        />
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
    </div>
  );
};

export default RecipeDetail;