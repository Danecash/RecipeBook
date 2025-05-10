import { useState, useEffect } from 'react';
import { searchRecipesByIngredients } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUtensils } from 'react-icons/fa';

const FindByIngredientsPage = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12;
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
    
    setCurrentPage(1);
    fetchRecipes();
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i);
      
      const response = await searchRecipesByIngredients(ingredientList, currentPage, limit);
      
      if (response.success) {
        setRecipes(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      } else {
        throw new Error(response.error || 'Failed to load recipes');
      }
    } catch (error) {
      console.error('Failed to load recipes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ingredients.trim() && currentPage > 1) {
      fetchRecipes();
    }
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-container">
      <div className="search-header">
        <h1><FaUtensils /> Find Recipes by Ingredients</h1>
        <p>Enter ingredients you have, separated by commas</p>
        
        <form onSubmit={handleSearch} className="ingredient-search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., chicken, potatoes, carrots"
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FaSearch /> Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading">Searching recipes...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : recipes.length > 0 ? (
        <>
          <div className="results-info">
            Found {totalItems} recipes matching your ingredients
          </div>
          
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <RecipeCard 
                key={recipe._id} 
                recipe={recipe}
                extraInfo={
                  <div className="match-info">
                    <span className="match-percentage">
                      {recipe.matchPercentage}% match
                    </span>
                    <div className="matched-ingredients">
                      {recipe.matchedIngredients.join(', ')}
                    </div>
                  </div>
                }
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : ingredients ? (
        <div className="empty-state">
          <p>No recipes found with these ingredients</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse All Recipes
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <p>Enter ingredients to find matching recipes</p>
        </div>
      )}
    </div>
  );
};

export default FindByIngredientsPage;