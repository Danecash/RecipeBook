import { FaStar } from 'react-icons/fa';
import PropTypes from 'prop-types';

const StarRating = ({ rating = 0, onRate, editable = true }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${rating >= star ? 'active' : ''}`}
          onClick={() => editable && onRate(star)}
          disabled={!editable}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  onRate: PropTypes.func,
  editable: PropTypes.bool
};

export default StarRating;