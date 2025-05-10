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
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const getRecipes = (page = 1, limit = 8) => api.get('/recipes', { params: { page, limit } });
export const getRecipeById = (id) => api.get(`/recipes/${id}`);

// Updated to support pagination
export const getRecipesByCategory = (category, page = 1, limit = 12, options = {}) => {
  return api.get(`/category/${encodeURIComponent(category)}`, {
    params: { page, limit },
    ...options
  });
};

export const searchRecipes = async (query, page = 1, limit = 12) => {
  try {
    const response = await api.get(`/search/${encodeURIComponent(query)}`, {
      params: { page, limit }
    });
    console.log('Raw search response:', response); // Debug log
    
    // If the response is an array, wrap it in a data object
    if (Array.isArray(response.data)) {
      return {
        ...response,
        data: {
          data: response.data,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(response.data.length / limit),
            totalItems: response.data.length,
            itemsPerPage: limit
          }
        }
      };
    }
    return response;
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

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

export const updateRecipe = (id, recipeData) => {
  const formData = new FormData();
  Object.keys(recipeData).forEach(key => {
    if (key === 'ingredients' || key === 'instructions') {
      formData.append(key, JSON.stringify(recipeData[key]));
    } else if (key === 'image') {
      formData.append('image', recipeData[key]);
    } else {
      formData.append(key, recipeData[key]);
    }
  });
  return api.put(`/recipes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
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
  response => {
    // Add pagination data to response if not present
    if (response.data && Array.isArray(response.data)) {
      return {
        ...response,
        data: {
          data: response.data,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: response.data.length,
            itemsPerPage: response.data.length
          }
        }
      };
    }
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const getFavorites = async () => {
  try {
    const response = await api.get('/favorites', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log('getFavorites response:', response.data);
    return response;
  } catch (error) {
    console.error('Error in getFavorites:', error);
    throw error;
  }
};

// Delete from favorites
export const deleteFavorite = async (recipeId) => {
  return axios.delete(`/api/favorites/${recipeId}`);
};

// Rate a recipe
export const rateRecipe = async (recipeId, rating) => {
  return axios.post(`/api/recipes/${recipeId}/rate`, { rating });
};

// Get recipe ratings
export const getRecipeRatings = async (recipeId) => {
  return axios.get(`/api/recipes/${recipeId}/ratings`);
};