// frontend/src/components/CategoryButtons.jsx
import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import '../styles/Navbar.css';

const categories = [
  { name: 'Appetizer', icon: '🥗' },
  { name: 'Meal', icon: '🍲' },
  { name: 'Beverages', icon: '🍹' },
  { name: 'Desserts', icon: '🍰' }
];

const CategoryButtons = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="nav-category-dropdown" ref={dropdownRef}>
      <button
        className="nav-link category-dropdown-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        type="button"
      >
        <span>Categories</span>
      </button>
      {open && (
        <div className="category-dropdown-menu">
          {categories.map((category) => {
            const path = `/category/${category.name.toLowerCase()}`;
            const isActive = location.pathname === path;
            return (
              <Link
                key={category.name}
                to={path}
                className={`dropdown-item${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryButtons;