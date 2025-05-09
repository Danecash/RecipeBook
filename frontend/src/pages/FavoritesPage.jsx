// frontend/src/pages/FavoritesPage.jsx
import { useEffect, useState } from 'react';
import { getFavorites } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async (page = 1) => {
      try {
        if (user) {
          console.log("Fetching favorites for user:", user);
          const response = await getFavorites(page);
          console.log("Favorites response:", response.data);
          const data = Array.isArray(response.data.data) ? response.data.data : [];
          setFavorites(data);
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (recipeId) => {
    try {
      const response = await toggleFavorite(recipeId);
      setFavorites((prevFavorites) => {
        if (prevFavorites.some((recipe) => recipe._id === recipeId)) {
          // Remove from favorites
          return prevFavorites.filter((recipe) => recipe._id !== recipeId);
        } else {
          // Add to favorites with full recipe details from response
          return [...prevFavorites, response.data.recipe];
        }
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setLoading(true);
      fetchFavorites(newPage);
    }
  };

  if (loading) return <div className="loading">Loading favorites...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="favorites-page">
      <h1>Your Favorite Recipes</h1>
      {favorites.length === 0 ? (
        <p>You haven't favorited any recipes yet</p>
      ) : (
        <div className="recipes-grid">
          {favorites.map(recipe => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe}
              onToggleFavorite={() => handleToggleFavorite(recipe._id)}
            />
          ))}
        </div>
      )}
      <div className="pagination-controls">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FavoritesPage;