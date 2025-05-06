// frontend/src/services/api.js

import axios from 'axios';
export const toggleFavorite = (recipeId) => api.post(`/recipes/${recipeId}/favorite`);
export const getFavorites = () => api.get('/favorites');

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(config => {
  console.log('Making request to:', config.url);
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(response => {
  console.log('Response received:', response.config.url);
  return response;
}, error => {
  console.error('API Error:', {
    message: error.message,
    config: error.config,
    response: error.response?.data
  });

  if (error.response) {
    // Server responded with error status (4xx, 5xx)
    return Promise.reject({
      message: error.response.data?.error || 'Server error occurred',
      response: error.response.data,
      status: error.response.status
    });
  } else if (error.request) {
    // Request was made but no response received
    return Promise.reject({
      message: 'No response from server. Please check your connection.'
    });
  } else {
    // Something happened in setting up the request
    return Promise.reject({
      message: 'Request setup error: ' + error.message
    });
  }
});

export const getRecipes = () => api.get('/recipes');
export const getRecipeById = (id) => api.get(`/recipes/${id}`);
export const getRecipesByCategory = (category) => api.get(`/category/${category}`);
export const searchRecipes = (query) => api.get(`/search/${query}`);

export const addRecipe = (recipeData) => {
  const formData = new FormData();

  console.log('Creating FormData with:', recipeData); // Debug log

  // Append all fields with validation
  try {
    Object.keys(recipeData).forEach(key => {
      if (key === 'ingredients' || key === 'instructions') {
        const value = Array.isArray(recipeData[key])
          ? JSON.stringify(recipeData[key])
          : recipeData[key];
        formData.append(key, value);
      } else if (key === 'image') {
        if (recipeData[key] instanceof File) {
          formData.append('image', recipeData[key]);
        } else if (recipeData[key]) {
          throw new Error('Image must be a File object');
        }
      } else {
        formData.append(key, recipeData[key]);
      }
    });

    return api.post('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 15000 // 15 seconds for uploads
    });
  } catch (error) {
    console.error('FormData creation error:', error);
    return Promise.reject(error);
  }
};