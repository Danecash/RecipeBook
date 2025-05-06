// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import CategoryPage from './pages/CategoryPage';
import FavoritesPage from './pages/FavoritesPage'; // Add this import
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} /> {/* Add this route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;