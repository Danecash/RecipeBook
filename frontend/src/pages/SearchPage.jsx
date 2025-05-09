// frontend/src/pages/SearchPage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';

const SearchPage = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await searchRecipes(query);
        setResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) return <div className="loading">Searching...</div>;

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