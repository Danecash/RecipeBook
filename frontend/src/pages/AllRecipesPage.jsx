// frontend/src/AllRecipesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { FaUtensils, FaGlassMartiniAlt, FaIceCream, FaDrumstickBite } from 'react-icons/fa';
import './AllRecipesPage.css';

const AllRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageStates, setPageStates] = useState({
    all: { currentPage: 1, totalPages: 1 },
    Appetizer: { currentPage: 1, totalPages: 1 },
    Beverages: { currentPage: 1, totalPages: 1 },
    Desserts: { currentPage: 1, totalPages: 1 },
    Meal: { currentPage: 1, totalPages: 1 }
  });
  const limit = 12;
  const [currentCategory, setCurrentCategory] = useState('all');

  const categories = [
    { id: 'all', title: 'All Recipes', description: 'Browse all recipes', icon: <FaUtensils /> },
    { id: 'Appetizer', title: 'Appetizers', description: 'Starters and snacks', icon: <FaGlassMartiniAlt /> },
    { id: 'Beverages', title: 'Beverages', description: 'Drinks and refreshments', icon: <FaGlassMartiniAlt /> },
    { id: 'Desserts', title: 'Desserts', description: 'Sweet treats', icon: <FaIceCream /> },
    { id: 'Meal', title: 'Main Meals', description: 'Complete dishes', icon: <FaDrumstickBite /> }
  ];

  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await getAllRecipes(
        pageStates[currentCategory].currentPage,
        limit,
        '',
        currentCategory === 'all' ? 'all' : currentCategory,
        'newest'
      );
      setRecipes(response.data);
      setPageStates(prev => ({
        ...prev,
        [currentCategory]: {
          ...prev[currentCategory],
          totalPages: response.pagination.totalPages
        }
      }));
      setError(null);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRecipes();
  }, [currentCategory, pageStates[currentCategory].currentPage]);

  const handlePageChange = (newPage) => {
    setPageStates(prev => ({
      ...prev,
      [currentCategory]: {
        ...prev[currentCategory],
        currentPage: newPage
      }
    }));
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (categoryId) => {
    setCurrentCategory(categoryId);
    // Reset to page 1 when changing categories
    setPageStates(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        currentPage: 1
      }
    }));
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="page-container">
        <div className="loading">Loading recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="all-header">
        <h1>All Recipes</h1>
      </div>

      <div className="recipe-timeline">
        {categories.map((category, index) => (
          <div 
            key={category.id} 
            className={`timeline-step ${currentCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            <div className="timeline-icon">
              {category.icon}
            </div>
            <div className="timeline-content">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
            {index < categories.length - 1 && <div className="timeline-line" />}
          </div>
        ))}
      </div>

      <div className="recipes-grid">
        {recipes.map(recipe => (
          <div key={recipe._id} className="recipe-card-wrapper">
            <RecipeCard recipe={recipe} showStats={true} />
          </div>
        ))}
      </div>

      {pageStates[currentCategory].totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pageStates[currentCategory].currentPage - 1)}
            disabled={pageStates[currentCategory].currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {pageStates[currentCategory].currentPage} of {pageStates[currentCategory].totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pageStates[currentCategory].currentPage + 1)}
            disabled={pageStates[currentCategory].currentPage === pageStates[currentCategory].totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllRecipesPage;
