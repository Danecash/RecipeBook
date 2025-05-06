// frontend/src/pages/CategoryPage.jsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipesByCategory } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';

const CategoryPage = () => {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Items per page

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getRecipesByCategory(category, currentPage, limit);
        setRecipes(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [category, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="loading">Loading {category} recipes...</div>;

  return (
    <div className="category-page">
      <h1>{category} Recipes</h1>
      <Link to="/" className="back-link">← Back to All Recipes</Link>

      <div className="recipes-grid">
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CategoryPage;