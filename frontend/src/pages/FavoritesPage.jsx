// frontend/src/pages/FavoritesPage.jsx

import { useEffect, useState } from 'react';
import { getFavorites, toggleFavorite } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10; // Changed to 10 recipes per page
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        navigate('/login');
        return;
      }

      const response = await getFavorites(currentPage, limit);
      console.log('Favorites response:', response); // Debug log
      
      if (response.success) {
        setFavorites(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.totalItems || 0);
      } else {
        throw new Error(response.error || 'Failed to load favorites');
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setError(error.message);
      toast.error(error.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, currentPage]);

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await toggleFavorite(recipeId);
      // Optimistic update
      setFavorites(prev => prev.filter(recipe => recipe._id !== recipeId));
      setTotalItems(prev => prev - 1);
      toast.success('Removed from favorites');
      
      // Go back a page if we removed the last item on the page
      if (favorites.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      toast.error('Failed to remove from favorites');
      fetchFavorites(); // Refresh data if something went wrong
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Loading favorites...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <h1>Your Favorite Recipes ({totalItems})</h1>
      
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>You haven't favorited any recipes yet</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Browse Recipes
          </button>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {favorites.map(recipe => (
              <RecipeCard 
                key={`${recipe._id}-${currentPage}`}
                recipe={recipe}
                showRemoveButton={true}
                onRemove={() => handleRemoveFavorite(recipe._id)}
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

export default FavoritesPage;