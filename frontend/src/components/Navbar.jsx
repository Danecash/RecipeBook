// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CategoryButtons from './CategoryButtons';
import '../styles/Navbar.css';
import {
  FaHome,
  FaFire,
  FaHeart,
  FaPlus,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUtensils,
  FaUserCircle,
  FaSearch
} from 'react-icons/fa';


const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">

          {/* Logo */}
          <div className="nav-logo">
            <Link to="/" className="logo">
              <span className="logo-icon">🍳</span>
              <span className="logo-text">RecipeBook</span>
            </Link>
          </div>

          {/* Main Navigation Links */}
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
              <FaUtensils className="nav-icon" />
              <span>All Recipes</span>
            </Link>
            <Link to="/find-by-ingredients" className="nav-link">
              <FaSearch className="nav-icon" />
              <span>Find Recipes</span>
            </Link>
            {/* Insert Category Dropdown here */}
            <CategoryButtons />
          </div>

          {/* User Account Links */}
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
                <div className="user-dropdown">
                  <button className="user-btn">
                    <FaUserCircle className="nav-icon" />
                    <span>{user.name}</span>
                  </button>
                  <div className="dropdown-content">
                    <button onClick={logout} className="dropdown-item">
                      <FaSignOutAlt className="nav-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
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

      {/* Category Buttons below navbar */}
      {/* <CategoryButtons /> */}
    </>
  );
};

export default Navbar;
