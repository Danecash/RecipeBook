// frontend/src/components/CategoryButtons.jsx
import { Link } from 'react-router-dom';

const categories = ['Appetizer', 'Beverages', 'Desserts', 'Meal'];

const CategoryButtons = () => {
  return (
    <div className="category-buttons">
      {categories.map((category) => (
        <Link 
          key={category} 
          to={`/category/${category.toLowerCase()}`}
          className={`category-button ${category.toLowerCase()}`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
};

export default CategoryButtons;