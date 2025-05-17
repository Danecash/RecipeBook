// frontend/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getRecipes, getPopularRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SectionHeader from '../components/SectionHeader';
import SearchBar from '../components/SearchBar';
import { FaFire } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUtils';
import './Home.css';

const Home = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [categoryRecipes, setCategoryRecipes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const featuredResponse = await getRecipes(1, 8);
        setFeaturedRecipes(featuredResponse.data.data || []);

        const popularResponse = await getPopularRecipes(1, 10);
        setPopularRecipes(popularResponse.data || []);

        const categories = ['Appetizer', 'Meal', 'Beverages', 'Desserts'];
        const categoryPromises = categories.map(category =>
          getRecipes(1, 10, { category })
        );

        const categoryResults = await Promise.all(categoryPromises);
        const categoryData = {};
        categories.forEach((category, index) => {
          categoryData[category] = categoryResults[index].data.data || [];
        });

        setCategoryRecipes(categoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading recipes...</div>;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Delicious Recipes</h1>
          <p>Find your next favorite meal from our curated collection</p>
          <div className="hero-search">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="section">
        <SectionHeader title="Featured Recipes" link="/all-recipes" />
        <div className="recipes-grid">
          {featuredRecipes.map(recipe => (
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
      </section>

      {/* Popular Recipes */}
      <section className="section">
        <SectionHeader title="Popular Recipes" icon={<FaFire />} link="/popular" />
        <div className="recipes-grid">
          {popularRecipes.map(recipe => (
            <RecipeCard
              key={recipe._id}
              showStats={true}
              recipe={{
                ...recipe,
                image: getImageUrl(recipe.image),
                imageOptimized: getImageUrl(recipe.imageOptimized),
              }}
            />
          ))}
        </div>
      </section>

      {/* Category Sections */}
      {['Appetizer', 'Meal', 'Beverages', 'Desserts'].map(category => (
        <section key={category} className="section">
          <SectionHeader title={`${category} Recipes`} link={`/category/${category.toLowerCase()}`} />
          <div className="recipes-grid">
            {categoryRecipes[category]?.map(recipe => (
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
        </section>
      ))}
    </div>
  );
};

export default Home;
