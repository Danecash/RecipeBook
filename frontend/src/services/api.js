// frontend/src/App.jsx

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// Auth endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/user');

// Updated getFavorites to maintain array response
export const getFavorites = async (page = 1, limit = 8) => {
  try {
    const response = await api.get('/favorites', {
      params: { page, limit }
    });
    console.log('Favorites API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error.response?.data || error.message);
    throw error;
  }
};

// Recipe endpoints
export const toggleFavorite = (recipeId) => {
  return api.post(`/recipes/${recipeId}/favorite`);
};

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

export const searchRecipes = (query, page = 1, limit = 12) => {
  return api.get(`/search/${encodeURIComponent(query)}`, {
    params: { page, limit }
  });
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

// Request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Response interceptor with pagination fallback
api.interceptors.response.use(
  response => {
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

export const rateRecipe = (recipeId, { rating, comment }) => {
  return api.post(`/recipes/${recipeId}/rate`, { rating, comment });
};

export const updateRecipe = (recipeId, recipeData) => {
  const formData = new FormData();
  Object.keys(recipeData).forEach(key => {
    if (key === 'ingredients' || key === 'instructions') {
      formData.append(key, JSON.stringify(recipeData[key]));
    } else if (key === 'image' && recipeData[key] instanceof File) {
      formData.append('image', recipeData[key]);
    } else if (recipeData[key] !== null && recipeData[key] !== undefined) {
      formData.append(key, recipeData[key]);
    }
  });
  return api.put(`/recipes/${recipeId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};


export default api;
