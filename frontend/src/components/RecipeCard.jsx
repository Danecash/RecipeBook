// frontend/src/components/RecipeCard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteButton from './FavoriteButton';
import { FaHeart, FaStar, FaComment, FaClock, FaTimes } from 'react-icons/fa';
import ImageWithFallback from './ImageWithFallback';
import { getImageUrl, imageStyle } from '../utils/imageUtils';
import './RecipeCard.css';

const RecipeCard = ({
  recipe,
  showStats = false,
  showFavoriteOnly = false,
  showRemoveButton = false,
  onRemove,
  extraInfo = null,
}) => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe._id}`} state={{ recipe }}>
        <div className="card-image-container">
          <div className="card-image">
            <ImageWithFallback
              src={getImageUrl(recipe.imageOptimized || recipe.image)}
              alt={recipe.name}
              style={imageStyle}
              fallbackSrc="/placeholder-recipe.jpg"
            />
          </div>
          <div className="card-overlay">
            <span className={`category-tag ${recipe.category?.toLowerCase()}`}>
              {recipe.category}
            </span>
          </div>
        </div>

        <div className="card-content">
          <h3>{recipe.name}</h3>
          
          <div className="recipe-date">
            <FaClock />
            <span>Added {formatDate(recipe.createdAt)}</span>
          </div>

          {showStats && (
            <div className="recipe-stats" onClick={handleFavoriteClick}>
              <FavoriteButton
                recipeId={recipe._id}
                initialCount={recipe.favoriteCount || 0}
                isInitiallyFavorited={recipe.favorites?.includes(user?._id) || false}
              />
              {!showFavoriteOnly && (
                <>
                  <div className="stat">
                    <FaStar /> {recipe.averageRating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="stat">
                    <FaComment /> {recipe.reviews?.length || 0}
                  </div>
                </>
              )}
            </div>
          )}

          {extraInfo && <div className="recipe-extra-info">{extraInfo}</div>}
        </div>
      </Link>

      {showRemoveButton && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="remove-btn"
          aria-label="Remove from favorites"
        >
          <FaTimes className="remove-icon" />
          <span>Remove from Favorites</span>
        </button>
      )}
    </div>
  );
};

export default RecipeCard;
