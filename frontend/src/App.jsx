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
import PopularRecipesPage from './pages/PopularRecipesPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllRecipesPage from './pages/AllRecipesPage';
import FindByIngredientsPage from './pages/FindByIngredientsPage';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/add-recipe" element={<AddRecipe />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/search/:query" element={<SearchPage />} />
                <Route path="/popular" element={<PopularRecipesPage />} />
                <Route path="/all-recipes" element={<AllRecipesPage />} />
                <Route path="/find-by-ingredients" element={<FindByIngredientsPage />} />
              </Routes>
            </main>
            <Footer />
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
              toastClassName="toast-message"
              progressClassName="toast-progress"
            />
          </div>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;