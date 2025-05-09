// frontend/src/components/FavoriteButton.jsx

import { useState } from 'react';
import { toggleFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FavoriteButton = ({ 
  recipeId, 
  initialCount, 
  isInitiallyFavorited,
  onFavoriteChange
}) => {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [favoriteCount, setFavoriteCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to favorite recipes');
      return;
    }

    try {
      setIsLoading(true);
      const response = await toggleFavorite(recipeId);
      setIsFavorited(!isFavorited);
      setFavoriteCount(response.data.favoriteCount);
      toast.success(
        isFavorited 
          ? 'Removed from favorites' 
          : 'Added to favorites'
      );
      if (onFavoriteChange) onFavoriteChange();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      disabled={isLoading}
      className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
    >
      {isFavorited ? '❤️' : '♡'} {favoriteCount}
    </button>
  );
};

export default FavoriteButton;