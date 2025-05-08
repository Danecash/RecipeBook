// frontend/src/pages/CategoryPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getRecipesByCategory } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';

const CategoryPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12;

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await getRecipesByCategory(
          category, 
          currentPage, 
          limit,
          { signal } // Pass abort signal
        );

        if (!signal.aborted) {
          setRecipes(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
          setTotalItems(response.data.pagination.totalItems);
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error fetching recipes:", error);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRecipes();

    return () => controller.abort();
  }, [category, currentPage, location.key]);

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="loading">Loading {category} recipes...</div>;

  return (
    <div className="category-page">
      <h1>{category} Recipes</h1>
      <Link to="/" className="back-link">← Back to All Recipes</Link>

      {recipes.length === 0 ? (
        <p>No recipes found in this category.</p>
      ) : (
        <>
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <RecipeCard 
                key={`${recipe._id}-${currentPage}`} 
                recipe={recipe} 
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

export default CategoryPage;