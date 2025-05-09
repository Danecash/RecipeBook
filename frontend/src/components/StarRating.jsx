// frontend/components/StarRating.jsx

import { FaStar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const StarRating = ({ rating = 0, onRate, editable = true, showRating = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [displayRating, setDisplayRating] = useState(rating);

  useEffect(() => {
    setDisplayRating(rating);
  }, [rating]);

  const handleMouseEnter = (star) => {
    if (editable) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  const handleClick = (star) => {
    if (editable && onRate) {
      onRate(star);
      setDisplayRating(star);
    }
  };

  return (
    <div className="star-rating-container">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${(hoverRating || displayRating) >= star ? 'active' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!editable}
          >
            <FaStar />
          </button>
        ))}
      </div>
      {showRating && displayRating > 0 && (
        <span className="rating-value">{displayRating.toFixed(1)}</span>
      )}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  onRate: PropTypes.func,
  editable: PropTypes.bool,
  showRating: PropTypes.bool
};

export default StarRating;