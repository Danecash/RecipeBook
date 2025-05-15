// frontend/src/pages/FindByIngredientsPage.jsx
import { useState, useEffect } from 'react';
import { searchRecipesByIngredients } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUtensils, FaExclamationTriangle, FaPlus, FaTimes } from 'react-icons/fa';
import '../pages/FindByIngredientsPage.css';


const FindByIngredientsPage = () => {
  const [ingredients, setIngredients] = useState(['']);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12;
  const navigate = useNavigate();

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Filter out empty ingredients
    const nonEmptyIngredients = ingredients.filter(ing => ing.trim() !== '');
    
    if (nonEmptyIngredients.length === 0) {
      setError("Please enter at least one ingredient");
      return;
    }

    setCurrentPage(1);
    fetchRecipes(nonEmptyIngredients);
  };

  const fetchRecipes = async (ingredientsToSearch) => {
    try {
      setLoading(true);
      setError(null);
      setRecipes([]);
      
      const response = await searchRecipesByIngredients(ingredientsToSearch, currentPage, limit);
      
      setRecipes(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const nonEmptyIngredients = ingredients.filter(ing => ing.trim() !== '');
    if (nonEmptyIngredients.length > 0 && currentPage > 1) {
      fetchRecipes(nonEmptyIngredients);
    }
  }, [currentPage]);

  return (
    <div className="page-container">
      <div className="search-header">
        <h1><FaUtensils /> Find Recipes by Ingredients</h1>
        <p>Add ingredients you have available (e.g., "egg", "milk", "flour")</p>
        
        <form onSubmit={handleSearch} className="ingredient-search-form">
          <div className="ingredients-input-container">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-input-group">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  className="ingredient-input"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientField(index)}
                    className="remove-ingredient-btn"
                    aria-label="Remove ingredient"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredientField}
              className="add-ingredient-btn"
            >
              <FaPlus /> Add Ingredient
            </button>
          </div>
          
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : <><FaSearch /> Search Recipes</>}
          </button>
          
          {error && (
            <div className="error-message">
              <FaExclamationTriangle /> {error}
            </div>
          )}
        </form>
      </div>

      {loading && <div className="loading">Searching recipes...</div>}

      {!loading && recipes.length > 0 && (
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
                      Uses: {recipe.matchedIngredients.join(', ')}
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
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {!loading && recipes.length === 0 && !error && (
        <div className="empty-state">
          <p>No recipes found. Try adding some ingredients.</p>
        </div>
      )}

      {!loading && error && (
        <div className="empty-state">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse All Recipes
          </button>
        </div>
      )}
    </div>
  );
};

export default FindByIngredientsPage;