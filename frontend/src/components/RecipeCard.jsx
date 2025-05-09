// frontend/src/components/RecipeCard.jsx
import { Link } from 'react-router-dom';
import RecipeImage from './RecipeImage';
import FavoriteButton from './FavoriteButton';
import { useAuth } from '../context/AuthContext';

const RecipeCard = ({ recipe, showRemoveButton = false, onRemove }) => {
  const { user } = useAuth();

  return (
    <div className="recipe-card">
      <Link 
        to={`/recipe/${recipe._id}`}
        state={{ recipe }}
      >
        <RecipeImage recipe={recipe} className="card-image" />
        <div className="card-content">
          <h3>{recipe.name}</h3>
          <span className={`category-tag ${recipe.category.toLowerCase()}`}>
            {recipe.category}
          </span>
          {recipe.averageRating && (
            <div className="rating-badge">
              ⭐ {recipe.averageRating}
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
            className="remove-favorite"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;