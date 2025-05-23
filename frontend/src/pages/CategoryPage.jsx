// frontend/src/pages/CategoryPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipesByCategory } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { getImageUrl } from '../utils/imageUtils';
import SectionHeader from '../components/SectionHeader';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await getRecipesByCategory(category, currentPage, limit);
        setRecipes(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [category, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Loading {category} recipes...</div>;

  return (
    <div className="category-page">
      <SectionHeader 
        title={`${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()} Recipes`} 
        link="/"
        backButton
      />

      {recipes.length === 0 ? (
        <p>No recipes found in this category.</p>
      ) : (
        <>
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                showStats={true}
                showFavoriteOnly={true}
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
      )}
    </div>
  );
};

export default CategoryPage;