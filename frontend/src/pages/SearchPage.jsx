// frontend/src/pages/SearchPage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';

const SearchPage = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchRecipes(query);
        console.log('Search response:', response); // Debug log
        
        // Handle both array and object responses
        const recipes = Array.isArray(response.data) ? response.data : 
                       response.data?.data || [];
        
        setResults(recipes);
      } catch (error) {
        console.error('Search error:', error);
        setError(error.response?.data?.error || 'Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) return <div className="loading">Searching...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="search-page">
      <h2>Search Results for "{query}"</h2>
      {results.length > 0 ? (
        <div className="recipes-grid">
          {results.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p>No recipes found. Try a different search term.</p>
      )}
    </div>
  );
};

export default SearchPage;