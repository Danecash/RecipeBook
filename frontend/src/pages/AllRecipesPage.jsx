// frontend/src/AllRecipesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { FaFilter, FaSort } from 'react-icons/fa';
import './AllRecipesPage.css';

const AllRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 12;

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await getAllRecipes(
        currentPage, 
        limit, 
        searchQuery, 
        'all', 
        sortBy
      );
      setRecipes(response.data);
      setTotalPages(response.pagination.totalPages);
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
    // eslint-disable-next-line
  }, [currentPage, sortBy, searchQuery]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAllRecipes();
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
        <div className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </div>
      </div>

      <div className={`filters-section ${showFilters ? 'show' : ''}`}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        <div className="sort-controls">
          <FaSort className="sort-icon" />
          <select value={sortBy} onChange={handleSortChange} className="sort-select">
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="recipes-grid">
        {recipes.map(recipe => (
          <div key={recipe._id} className="recipe-card-wrapper">
            <RecipeCard recipe={recipe} showStats={true} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
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
