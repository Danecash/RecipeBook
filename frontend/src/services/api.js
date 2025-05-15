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

export const getPopularRecipes = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/popular-recipes', {
      params: { 
        page,
        limit
      }
    });
    
    // Ensure the response has the expected structure
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
      };
    }
    throw new Error(response.data?.error || 'Invalid response structure');
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    throw error;
  }
};

export const getAllRecipes = async (page = 1, limit = 12, search = '', category = 'all', sort = 'newest') => {
  try {
    const response = await api.get('/all-recipes', {
      params: { page, limit, search, category, sort }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    throw error;
  }
};

export const searchRecipesByIngredients = async (ingredients, page = 1, limit = 12) => {
  try {
    // Ensure ingredients is an array
    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];
    
    // Filter out empty strings and encode
    const nonEmptyIngredients = ingredientsArray
      .filter(ing => ing.trim() !== '')
      .map(ing => encodeURIComponent(ing.trim()));
    
    if (nonEmptyIngredients.length === 0) {
      throw new Error("At least one valid ingredient is required");
    }

    const response = await api.get('/recipes/by-ingredients', {
      params: {
        ingredients: nonEmptyIngredients.join(','),
        page,
        limit
      }
    });

    if (!response.data?.success) {
      throw new Error(response.data?.error || 'Invalid response from server');
    }

    return response.data;
  } catch (error) {
    console.error('Error searching by ingredients:', error);
    
    // Handle 400 Bad Request specifically
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.error || 'Invalid ingredient search parameters');
    }
    
    throw new Error(error.response?.data?.error || 'Failed to search recipes');
  }
};

export const getRelatedRecipes = async (recipeId) => {
  try {
    const response = await api.get(`/recipes/${recipeId}/related`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const toggleBookmark = async (recipeId) => {
  try {
    const response = await api.post(`/recipes/${recipeId}/bookmark`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default api;
