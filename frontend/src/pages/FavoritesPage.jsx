// frontend/src/pages/FavoritesPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (user) {
          const response = await getFavorites();
          setFavorites(response.data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  if (loading) return <div className="loading">Loading favorites...</div>;

  return (
    <div className="favorites-page">
      <h1>Your Favorite Recipes</h1>
      <Link to="/" className="back-link">← Back to All Recipes</Link>

      {favorites.length > 0 ? (
        <div className="recipes-grid">
          {favorites.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p>You haven't favorited any recipes yet.</p>
      )}
    </div>
  );
};

export default FavoritesPage;