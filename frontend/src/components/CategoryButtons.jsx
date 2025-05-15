// frontend/src/components/CategoryButtons.jsx
import { Link } from 'react-router-dom';
import './CategoryButtons.css';

const categories = [
  { name: 'Appetizer', icon: '🥗' },
  { name: 'Meal', icon: '🍲' },
  { name: 'Beverages', icon: '🍹' },
  { name: 'Desserts', icon: '🍰' }
];

const CategoryButtons = () => {
  return (
    <div className="category-buttons-container">
      <div className="category-buttons">
        {categories.map((category) => (
          <Link 
            key={category.name} 
            to={`/category/${category.name.toLowerCase()}`}
            className={`category-button ${category.name.toLowerCase()}`}
          >
            <span className="category-icon">{category.icon}</span>
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons;