
// frontend/src/pages/FavoritesPage.jsx
import { useEffect, useState } from 'react';
import { getFavorites } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (user) {
          const response = await getFavorites();
          setFavorites(response.data || []);
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;