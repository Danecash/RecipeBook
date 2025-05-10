import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Rating.css';

const Rating = ({ recipeId, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await axios.get(`/api/recipes/${recipeId}/ratings`);
        const userRating = response.data.ratings.find(r => r.user._id === user?._id);
        if (userRating) {
          setUserRating(userRating.rating);
          setRating(userRating.rating);
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };

    if (user) {
      fetchUserRating();
    }
  }, [recipeId, user]);

  const handleRating = async (value) => {
    if (!user) {
      alert('Please login to rate recipes');
      return;
    }

    try {
      const response = await axios.post(`/api/recipes/${recipeId}/rate`, { rating: value });
      setRating(value);
      setUserRating(value);
      if (onRatingChange) {
        onRatingChange(response.data);
      }
    } catch (error) {
      console.error('Error rating recipe:', error);
      alert('Failed to rate recipe');
    }
  };

  return (
    <div className="rating-container">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star ${star <= (hover || rating) ? 'active' : ''}`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </button>
        ))}
      </div>
      {userRating && (
        <span className="user-rating">Your rating: {userRating}</span>
      )}
    </div>
  );
};

export default Rating; 