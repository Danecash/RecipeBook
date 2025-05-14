// frontend/src/components/RecipeImage.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './RecipeImage.module.css';

const RecipeImage = ({ image, imageOptimized, alt = 'Recipe', className = '' }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
    
    if (image?.startsWith('http')) {
      setImageUrl(image);
    } else if (image) {
      setImageUrl(`${baseUrl}${image}`);
    }

    if (imageOptimized?.startsWith('http')) {
      setImageUrl(imageOptimized);
    } else if (imageOptimized) {
      setImageUrl(`${baseUrl}${imageOptimized}`);
    }
  }, [image, imageOptimized]);

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={alt} 
          className={styles.image}
          onError={(e) => {
            e.target.src = '/placeholder-recipe.jpg';
          }}
        />
      ) : (
        <div className={styles.placeholder}>No Image Available</div>
      )}
    </div>
  );
};

RecipeImage.propTypes = {
  image: PropTypes.string,
  imageOptimized: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default RecipeImage;