// frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/search/:query" element={<SearchPage />} />
          </Routes>
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
