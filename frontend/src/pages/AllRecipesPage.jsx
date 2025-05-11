// frontend/src/AllRecipesPage.jsx

import { useEffect, useState } from 'react';
import { getAllRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';

const AllRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12;
  const navigate = useNavigate();

  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllRecipes(currentPage, limit);
      
      if (response.success) {
        setRecipes(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      } else {
        throw new Error(response.error || 'Failed to load recipes');
      }
    } catch (error) {
      console.error('Failed to load recipes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRecipes();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDurationText = (days) => {
    if (days === 0) return 'Added today';
    if (days === 1) return 'Added yesterday';
    if (days < 7) return `Added ${days} days ago`;
    if (days < 30) return `Added ${Math.floor(days/7)} weeks ago`;
    return `Added ${Math.floor(days/30)} months ago`;
  };

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>All Recipes</h1>
        <p>Browse our complete collection of recipes</p>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p>No recipes found</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <div key={recipe._id} className="recipe-card-wrapper">
                <RecipeCard recipe={recipe} />
                <div className="recipe-meta">
                  <span className="meta-item">
                    <FaCalendarAlt /> {new Date(recipe.createdAt).toLocaleDateString()}
                  </span>
                  <span className="meta-item">
                    <FaClock /> {getDurationText(recipe.daysSinceCreation)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default AllRecipesPage;