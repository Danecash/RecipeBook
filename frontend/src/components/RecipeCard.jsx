// frontend/src/components/RecipeCard.jsx
import { Link } from 'react-router-dom';
import RecipeImage from './RecipeImage';
import FavoriteButton from './FavoriteButton';
import { useAuth } from '../context/AuthContext';

const RecipeCard = ({ recipe, showStats = false, showRemoveButton = false, onRemove }) => {
  const { user } = useAuth();

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe._id}`} state={{ recipe }}>
        <RecipeImage recipe={recipe} className="card-image" />
        <div className="card-content">
          <h3>{recipe.name}</h3>
          <span className={`category-tag ${recipe.category.toLowerCase()}`}>
            {recipe.category}
          </span>
          
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
        </div>
      </Link>
      
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
  );
};

export default RecipeCard;