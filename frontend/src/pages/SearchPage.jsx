// frontend/src/pages/SearchPage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { getImageUrl } from '../utils/imageUtils';
import '../pages/SearchPage.css';

const SearchPage = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await searchRecipes(query, currentPage, limit);
        setResults(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Searching...</div>;

  return (
    <div className="search-page">
      <h2>Search Results for "{decodeURIComponent(query)}"</h2>
      {results.length > 0 ? (
        <>
          <div className="recipes-grid">
            {results.map(recipe => (
              <RecipeCard 
                key={recipe._id} 
                recipe={{
                  ...recipe,
                  image: getImageUrl(recipe.image),
                  imageOptimized: getImageUrl(recipe.imageOptimized),
                }}
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
      ) : (
        <p>No recipes found. Try a different search term.</p>
      )}
    </div>
  );
};

export default SearchPage;
