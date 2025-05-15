// frontend/src/components/RecipeImage.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './RecipeImage.css';

const RecipeImage = ({ image, alt = 'Recipe', className = '' }) => {
  const getImageUrl = (img) => {
    if (!img) return '/placeholder-recipe.jpg';
    if (img.startsWith('http')) return img;
    return `${process.env.REACT_APP_API_BASE_URL || ''}${img}`;
  };

  return (
    <div className={`image-container ${className}`}>
      <img
        src={getImageUrl(image)}
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
  image: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default RecipeImage;