// src/pages/RecipeDetail.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById } from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getRecipeById(id);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="recipe-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Recipes
      </button>

      <div className="recipe-header">
        <h1>{recipe.name}</h1>
        <span className="category-badge">{recipe.category}</span>
      </div>

      <div className="image-container">
        <img
          src={`http://localhost:3000/backend/uploads/${recipe.image}`}
          alt={recipe.name}
          onError={(e) => {
            e.target.src = '/placeholder-recipe.jpg';
          }}
        />
      </div>

      <div className="recipe-content">
        <section className="ingredients">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        </section>

        <section className="instructions">
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((instruction, i) => (
              <li key={i}>{instruction}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
};

export default RecipeDetail;