// frontend/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getRecipes, getPopularRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SectionHeader from '../components/SectionHeader';
import SearchBar from '../components/SearchBar';
import { FaFire } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUtils';
import '../styles/Home.css';

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

        // Fetch all recipes (large limit) and filter on frontend for robust category/tag matching
        const allRecipesResponse = await getRecipes(1, 100);
        const allRecipes = allRecipesResponse.data.data || [];
        const categories = ['Appetizer', 'Meal', 'Beverages', 'Desserts'];
        const categoryData = {};
        categories.forEach(category => {
          const normalizedCategory = category.trim().toLowerCase().replace(/\s+/g, '');
          const recipes = allRecipes.filter(r => {
            const recipeCat = (r.category || '').trim().toLowerCase().replace(/\s+/g, '');
            const catMatch = recipeCat.includes(normalizedCategory) || normalizedCategory.includes(recipeCat);
            let tagMatch = false;
            if (Array.isArray(r.tags)) {
              tagMatch = r.tags.some(tag => {
                if (!tag) return false;
                const normTag = tag.trim().toLowerCase().replace(/\s+/g, '');
                return normTag.includes(normalizedCategory) || normalizedCategory.includes(normTag);
              });
            }
            return catMatch || tagMatch;
          }).slice(0, 10);
          categoryData[category] = recipes;
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

  const categories = [
    { name: 'Appetizer' },
    { name: 'Meal' },
    { name: 'Beverages' },
    { name: 'Desserts' },
  ];

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
  <div className="featured-scroll-list">
    {featuredRecipes.map(recipe => (
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
</section>

      {/* Category Recipes - Single Column, Horizontal Scroll */}
      <section className="section category-sections">
        {categories.map(({ name: category }) => (
          <div key={category} className="category-row">
            {/* Category Header */}
            <div className="category-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h2 className="category-title" style={{ margin: 0, fontWeight: 600, fontSize: '1.5rem', color: '#2d2d2d', letterSpacing: '0.5px' }}>Top 10 {category}</h2>
              <a
                href={`/category/${encodeURIComponent(category)}`}
                className="see-more"
                style={{ color: '#ff7f50', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', marginLeft: '1.5rem', transition: 'color 0.2s', whiteSpace: 'nowrap' }}
                aria-label={`See more ${category} recipes`}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = `/category/${encodeURIComponent(category)}`; }}
              >
                See more &gt;&gt;
              </a>
            </div>
            <div className="category-scroll-list">
              {(categoryRecipes[category] && categoryRecipes[category].length > 0) ? (
                categoryRecipes[category].map(recipe => (
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
                ))
              ) : (
                <div className="empty-category-message" style={{color:'#888',fontSize:'1.1rem',padding:'2rem 0'}}>No recipes found in this category.</div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Popular Recipes */}
<section className="section">
  <SectionHeader title="Popular Recipes" icon={<FaFire />} link="/popular" />
  <div className="popular-scroll-list">
    {popularRecipes.map(recipe => (
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
</section>

    </div>
  );
};

export default Home;
