// frontend/src/components/RecipeImage.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './RecipeImage.css';

const RecipeImage = ({ recipe, alt = 'Recipe', className = '' }) => {
  const getImageUrl = (recipe) => {
    if (!recipe) return '/placeholder-recipe.jpg';
    
    // Use optimized image if available
    if (recipe.imageOptimized) {
      if (recipe.imageOptimized.startsWith('http')) return recipe.imageOptimized;
      return `http://localhost:3000${recipe.imageOptimized}`;
    }
    
    // Fallback to original image
    if (recipe.image) {
      if (recipe.image.startsWith('http')) return recipe.image;
      return `http://localhost:3000${recipe.image}`;
    }
    
    return '/placeholder-recipe.jpg';
  };

  return (
    <div className={`image-container ${className}`}>
      <img
        src={getImageUrl(recipe)}
        alt={alt}
        className="recipe-image"
        onError={(e) => {
          e.target.src = '/placeholder-recipe.jpg';
        }}
      />
    </div>
  );
};

RecipeImage.propTypes = {
  recipe: PropTypes.shape({
    image: PropTypes.string,
    imageOptimized: PropTypes.string
  }),
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default RecipeImage;