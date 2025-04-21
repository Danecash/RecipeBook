import React, { useEffect, useState } from 'react';
import { fetchPaginatedRecipes, addReview } from './services/api';
import './index.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // For search
  const [page, setPage] = useState(1); // For pagination

  // Fetch recipes with pagination
  useEffect(() => {
    fetchPaginatedRecipes(page, 10) // Fetch 10 recipes per page
      .then((response) => {
        console.log('Fetched recipes:', response.data.data); // Debugging
        setRecipes(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error.response || error.message);
        setError('Failed to fetch recipes');
        setLoading(false);
      });
  }, [page]);

  // Filter recipes based on the search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a review
  const handleAddReview = (id, review) => {
    addReview(id, review)
      .then(() => alert('Review added successfully!'))
      .catch((error) => console.error('Error adding review:', error));
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      {/* Tailwind-styled Header */}
      <h1 className="text-3xl font-bold underline">Recipes</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 mb-4"
      />

      {/* Recipe List */}
      <ul>
        {filteredRecipes.map((recipe) => (
          <li key={recipe._id} className="mb-4">
            {recipe.name || 'Unnamed Recipe'}
            {/* Add Review Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const review = {
                  rating: e.target.rating.value,
                  comment: e.target.comment.value,
                };
                handleAddReview(recipe._id, review);
              }}
              className="mt-2"
            >
              <input
                type="number"
                name="rating"
                placeholder="Rating (1-5)"
                required
                className="border border-gray-300 rounded px-2 py-1 mr-2"
              />
              <input
                type="text"
                name="comment"
                placeholder="Comment"
                required
                className="border border-gray-300 rounded px-2 py-1 mr-2"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Review
              </button>
            </form>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded mr-2 ${
            page === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;