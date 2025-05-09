
// frontend/src/components/RecipeCard.jsx
import { Link } from 'react-router-dom';
import RecipeImage from './RecipeImage';
import FavoriteButton from './FavoriteButton';
import { useAuth } from '../context/AuthContext';

const RecipeCard = ({ recipe }) => {
  const { user } = useAuth();

  return (
    <div className="recipe-card">
      <Link 
        to={`/recipe/${recipe._id}`}
        state={{ recipe }} // Pass recipe data in navigation state
      >
        <RecipeImage recipe={recipe} className="card-image" />
        <div className="card-content">
          <h3>{recipe.name}</h3>
          <span className={`category-tag ${recipe.category.toLowerCase()}`}>
            {recipe.category}
          </span>
        </div>
      </Link>
      <FavoriteButton 
        recipeId={recipe._id}
        initialCount={recipe.favoriteCount || 0}
        isInitiallyFavorited={recipe.favorites?.includes(user?._id) || false}
      />
    </div>
  );
};

export default RecipeCard;