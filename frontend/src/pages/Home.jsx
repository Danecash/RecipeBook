// frontend/src/pages/Home.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const response = await getRecipes();
        // Get 4 random recipes to feature
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setFeaturedRecipes(shuffled.slice(0, 4));
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedRecipes();
  }, []);

  if (loading) return <div className="loading">Loading recipes...</div>;

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to Recipe Collection</h1>
        <p>Discover delicious recipes for every occasion</p>
        <Link to="/add-recipe" className="cta-button">Add Your Recipe</Link>
      </section>

      <section className="featured-recipes">
        <h2>Featured Recipes</h2>
        <div className="recipes-grid">
          {featuredRecipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;