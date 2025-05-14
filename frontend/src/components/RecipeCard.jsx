// frontend/src/components/RecipeCard.jsx
import { Link } from 'react-router-dom';
import RecipeImage from './RecipeImage';
import FavoriteButton from './FavoriteButton';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaStar, FaComment } from 'react-icons/fa';

const RecipeCard = ({
  recipe,
  showStats = false,
  showRemoveButton = false,
  onRemove,
  extraInfo = null,
}) => {
  const { user } = useAuth();

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe._id}`} state={{ recipe }}>
        <div className="card-image-container">
          <RecipeImage recipe={recipe} className="card-image" />
          <div className="card-overlay">
            <span className={`category-tag ${recipe.category.toLowerCase()}`}>
              {recipe.category}
            </span>
          </div>
        </div>
        <div className="card-content">
          <h3>{recipe.name}</h3>

          {showStats && (
            <div className="recipe-stats">
              <div className="stat">
                <FaHeart /> {recipe.favoriteCount || 0}
              </div>
              <div className="stat">
                <FaStar /> {recipe.averageRating?.toFixed(1) || '0.0'}
              </div>
              <div className="stat">
                <FaComment /> {recipe.reviews?.length || 0}
              </div>
            </div>
          )}

          {extraInfo && (
            <div className="recipe-extra-info">
              {extraInfo}
            </div>
          )}
        </div>
      </Link>

      <div className="card-actions">
        <FavoriteButton 
          recipeId={recipe._id}
          initialCount={recipe.favoriteCount || 0}
          isInitiallyFavorited={recipe.favorites?.includes(user?._id) || false}
        />
        
        {showRemoveButton && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            className="remove-btn"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
