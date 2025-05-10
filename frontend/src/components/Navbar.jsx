// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import {
  FaHome,
  FaFire,
  FaHeart,
  FaPlus,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUtensils, // ✅ New icon import
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">🍳</span>
        <span className="logo-text">Recipe App</span>
      </Link>

      <div className="nav-links">
        <SearchBar />

        <div className="main-links">
          <Link to="/" className="nav-link">
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
          <Link to="/popular" className="nav-link">
            <FaFire className="nav-icon" />
            <span>Popular</span>
          </Link>
          <Link to="/all-recipes" className="nav-link">
            <FaFire className="nav-icon" />
            <span>All Recipes</span>
          </Link>
          <Link to="/find-by-ingredients" className="nav-link"> {/* ✅ New link */}
            <FaUtensils className="nav-icon" />
            <span>Find Recipes</span>
          </Link>
        </div>

        <div className="user-links">
          {user ? (
            <>
              <Link to="/favorites" className="nav-link">
                <FaHeart className="nav-icon" />
                <span>Favorites</span>
              </Link>
              <Link to="/add-recipe" className="nav-link">
                <FaPlus className="nav-icon" />
                <span>Add Recipe</span>
              </Link>
              <button onClick={logout} className="logout-btn">
                <FaSignOutAlt className="nav-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <FaSignInAlt className="nav-icon" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="nav-link">
                <FaUserPlus className="nav-icon" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
