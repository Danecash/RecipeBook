// frontend/src/components/RecipeCard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteButton from './FavoriteButton';
import { FaHeart, FaStar, FaComment } from 'react-icons/fa';
import ImageWithFallback from './ImageWithFallback';
import { getImageUrl, imageStyle } from '../utils/imageUtils';
import './RecipeCard.css';

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

          {extraInfo && <div className="recipe-extra-info">{extraInfo}</div>}
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
