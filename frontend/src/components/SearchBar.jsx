// frontend/src/components/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
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
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
        minLength={2}
      />
      <button type="submit" className="search-button">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
