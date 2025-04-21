import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend base URL
  timeout: 10000,
  withCredentials: true,
});

// Debugging: Log the baseURL
console.log('API Base URL:', API.defaults.baseURL);

// Recipe API calls
export const fetchRecipes = () => API.get('/recipes');
export const fetchRecipeById = (id) => API.get(`/recipes/${id}`);
export const searchRecipes = (query) => API.get(`/search/${query}`);
export const fetchByCategory = (category) => API.get(`/category/${category}`);
export const fetchFavorites = () => API.get('/favorites');
export const fetchPaginatedRecipes = (page, limit, sort, category) =>
  API.get('/paginate', { params: { page, limit, sort, category } });
export const fetchPopularIngredients = () => API.get('/popular-ingredients');
export const searchByIngredients = (ingredients) =>
  API.get('/search/ingredients', { params: { q: ingredients } });
export const fetchRecentRecipes = (days) => API.get(`/recipes/recent/${days}`);

export const addRecipe = (newRecipe) => API.post('/recipes', newRecipe);
export const addReview = (id, review) => API.post(`/recipes/${id}/review`, review);
export const updateRecipe = (id, updatedRecipe) => API.put(`/recipes/${id}`, updatedRecipe);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
export const toggleFavorite = (id) => API.patch(`/${id}/favorite`);

export default API;