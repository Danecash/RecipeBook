// frontend/src/components/RecipeCard.jsx

import { Link } from 'react-router-dom';
import RecipeImage from './RecipeImage';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe._id}`}>
        <RecipeImage recipe={recipe} className="card-image" />
        <div className="card-content">
          <h3>{recipe.name}</h3>
          <span className={`category-tag ${recipe.category.toLowerCase()}`}>
            {recipe.category}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;