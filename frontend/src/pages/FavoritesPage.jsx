// frontend/src/pages/FavoritesPage.jsx

import { useEffect, useState } from 'react';
import { getFavorites, toggleFavorite } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      if (user) {
        const response = await getFavorites(currentPage, limit);
        setFavorites(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      }
    } catch (error) {
      setError('Failed to load favorites');
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, currentPage]);

  const handleRemoveFavorite = async (recipeId) => {
    if (!window.confirm('Remove from favorites?')) return;
    
    try {
      await toggleFavorite(recipeId);
      setFavorites(prev => prev.filter(r => r._id !== recipeId));
      toast.success('Removed from favorites!');
      // Update total count after removal
      setTotalItems(prev => prev - 1);
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Loading favorites...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="favorites-page">
      <h1>Your Favorite Recipes</h1>
      
      {favorites.length === 0 ? (
        <p>You haven't favorited any recipes yet</p>
      ) : (
        <>
          <div className="recipes-grid">
            {favorites.map(recipe => (
              <RecipeCard 
                key={recipe._id} 
                recipe={recipe}
                showRemoveButton={true}
                onRemove={() => handleRemoveFavorite(recipe._id)}
              />
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

export default FavoritesPage;