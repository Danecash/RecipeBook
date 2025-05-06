// frontend/src/components/FavoriteButton.jsx

import { useState, useEffect } from 'react';
import { toggleFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FavoriteButton = ({ recipeId, initialCount, isInitiallyFavorited }) => {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [favoriteCount, setFavoriteCount] = useState(initialCount);
  const { user } = useAuth();

  const handleFavorite = async () => {
    if (!user) {
      alert('Please login to favorite recipes');
      return;
    }

    try {
      const response = await toggleFavorite(recipeId);
      setIsFavorited(!isFavorited);
      setFavoriteCount(response.data.favoriteCount);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
    >
      {isFavorited ? '❤️' : '♡'} {favoriteCount}
    </button>
  );
};

export default FavoriteButton;