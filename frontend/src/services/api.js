// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// Auth endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/user');

// Recipe endpoints
export const toggleFavorite = (recipeId) => api.post(`/recipes/${recipeId}/favorite`);
export const getFavorites = () => api.get('/favorites');
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const getRecipes = (page = 1, limit = 8) => api.get('/recipes', { params: { page, limit } });
export const getRecipeById = (id) => api.get(`/recipes/${id}`);
export const getRecipesByCategory = (category) => api.get(`/category/${category}`);
export const searchRecipes = (query) => api.get(`/search/${query}`);

export const addRecipe = (recipeData) => {
  const formData = new FormData();
  try {
    Object.keys(recipeData).forEach(key => {
      if (key === 'ingredients' || key === 'instructions') {
        formData.append(key, JSON.stringify(recipeData[key]));
      } else if (key === 'image') {
        formData.append('image', recipeData[key]);
      } else {
        formData.append(key, recipeData[key]);
      }
    });
    return api.post('/recipes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 15000
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);