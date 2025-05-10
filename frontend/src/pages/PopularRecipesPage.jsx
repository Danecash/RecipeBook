// frontend/src/pages/PopularRecipesPage.jsx
import { useEffect, useState } from 'react';
import { getPopularRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaStar, FaUsers } from 'react-icons/fa';

const PopularRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;
  const navigate = useNavigate();

  const fetchPopularRecipes = async () => {
    try {
      setLoading(true);
      const response = await getPopularRecipes(currentPage, limit);
      
      if (response.data.success) {
        setRecipes(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error('Failed to load popular recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularRecipes();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Loading popular recipes...</div>;

  return (
    <div className="popular-recipes-page">
      <div className="popular-header">
        <h1><FaFire /> Popular Recipes</h1>
        <p>Discover the most loved recipes by our community</p>
      </div>

      <div className="sorting-options">
        <button className="active">
          <FaFire /> Most Popular
        </button>
        <button>
          <FaStar /> Top Rated
        </button>
        <button>
          <FaUsers /> Most Reviewed
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p>No popular recipes found</p>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <RecipeCard 
                key={recipe._id}
                recipe={recipe}
                showStats={true}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PopularRecipesPage;