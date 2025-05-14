// frontend/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import CategoryButtons from '../components/CategoryButtons';
import { FaFire, FaSearch, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await getRecipes(currentPage, limit);
        setRecipes(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Loading recipes...</div>;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Delicious Recipes</h1>
          <p>Find your next favorite meal from our curated collection</p>
          <div className="search-container">
            <input type="text" placeholder="Search recipes..." />
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>
        </div>
      </section>

      {/* Category Buttons */}
      <CategoryButtons />

      {/* Featured Recipes */}
      <section className="section featured-recipes">
        <div className="section-header">
          <h2>
            <FaFire className="section-icon" />
            Featured Recipes
          </h2>
          <Link to="/popular" className="view-all">
            View All <FaArrowRight />
          </Link>
        </div>
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Category Sections */}
      {['Appetizer', 'Meal', 'Beverages', 'Desserts'].map(category => (
        <section key={category} className="section category-section">
          <div className="section-header">
            <h2>Top 10 {category}</h2>
            <Link to={`/category/${category.toLowerCase()}`} className="view-all">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="recipes-grid horizontal-scroll">
            {recipes
              .filter(r => r.category === category)
              .slice(0, 10)
              .map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
          </div>
        </section>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Home;