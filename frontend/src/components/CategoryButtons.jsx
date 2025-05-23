// frontend/src/components/CategoryButtons.jsx
import { Link, useLocation } from 'react-router-dom';
import '../styles/CategoryButtons.css';

const categories = [
  { name: 'Appetizer', icon: '🥗' },
  { name: 'Meal', icon: '🍲' },
  { name: 'Beverages', icon: '🍹' },
  { name: 'Desserts', icon: '🍰' }
];

const CategoryButtons = () => {
  const location = useLocation();
  
  return (
    <div className="category-buttons-container">
      <div className="category-buttons">
        {categories.map((category) => {
          const path = `/category/${category.name.toLowerCase()}`;
          const isActive = location.pathname === path;

          return (
            <Link 
              key={category.name} 
              to={path}
              className={`category-button ${category.name.toLowerCase()} ${isActive ? 'active' : ''}`}
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryButtons;
