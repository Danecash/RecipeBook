// frontend/src/pages/Home.jsx
import { useEffect, useState, useRef } from 'react';
import { getRecipes, getPopularRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SectionHeader from '../components/SectionHeader';
import { FaFire, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [categoryRecipes, setCategoryRecipes] = useState({});
  const [loading, setLoading] = useState(true);
  const scrollRefs = useRef({});

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

  const scroll = (category, direction) => {
    const container = scrollRefs.current[category];
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <div className="loading">Loading recipes...</div>;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Delicious Recipes</h1>
          <p>Find your next favorite meal from our curated collection</p>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="section">
        <SectionHeader title="Featured Recipes" link="/all-recipes" />
        <div className="recipes-grid">
          {featuredRecipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="section">
        <SectionHeader title="Popular Recipes" icon={<FaFire />} link="/popular" />
        <div className="recipes-grid">
          {popularRecipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} showStats={true} />
          ))}
        </div>
      </section>

      {/* Category Sections */}
      {['Appetizer', 'Meal', 'Beverages', 'Desserts'].map(category => (
        <section key={category} className="section">
          <SectionHeader title={`Top 10 ${category}`} link={`/category/${category.toLowerCase()}`} />
          
          <div className="horizontal-scroll-wrapper">
            <button className="scroll-btn left" onClick={() => scroll(category, 'left')}>
              <FaChevronLeft />
            </button>

            <div
              className="recipes-horizontal-scroll"
              ref={(el) => (scrollRefs.current[category] = el)}
            >
              {categoryRecipes[category]?.map((recipe, index) => (
                <div key={recipe._id} className="recipe-card-wrapper">
                  <span className="recipe-rank">{index + 1}</span>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>

            <button className="scroll-btn right" onClick={() => scroll(category, 'right')}>
              <FaChevronRight />
            </button>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
