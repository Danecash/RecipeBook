// frontend/src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar = () => {
  const categories = ['Appetizer', 'Beverages', 'Desserts', 'Meal'];

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Recipe App</Link>
      <SearchBar />
      <div className="nav-links">
        {categories.map(category => (
          <Link
            key={category}
            to={`/category/${category.toLowerCase()}`}
            className="nav-link"
          >
            {category}
          </Link>
        ))}
        <Link to="/add-recipe" className="add-recipe-link">+ Add Recipe</Link>
      </div>
    </nav>
  );
};

export default Navbar;