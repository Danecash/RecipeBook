// frontend/src/components/RecipeImage.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const RecipeImage = ({ recipe, className = '' }) => {
  const [imgSrc, setImgSrc] = useState(() => {
    if (!recipe?.image) return '/placeholder-recipe.jpg';

    // Check if it's already a full URL
    if (recipe.image.startsWith('http')) return recipe.image;

    // Handle optimized image
    if (recipe.imageOptimized) {
      return recipe.imageOptimized.startsWith('http')
        ? recipe.imageOptimized
        : `http://localhost:3000${recipe.imageOptimized}`;
    }

    // Default case
    return `http://localhost:3000${recipe.image}`;
  });

  const handleError = () => {
    setImgSrc('/placeholder-recipe.jpg');
  };

  return (
    <div className="image-container">
      <img
        src={imgSrc}
        alt={recipe?.name || 'Recipe image'}
        onError={handleError}
        className={`recipe-image ${className}`}
        loading="lazy"
      />
    </div>
  );
};

RecipeImage.propTypes = {
  recipe: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default RecipeImage;