// frontend/src/components/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/search/${encodeURIComponent(trimmedQuery)}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder="Search recipes..."
        className="search-bar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
        minLength={2}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;