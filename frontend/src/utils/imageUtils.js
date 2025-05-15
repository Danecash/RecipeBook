// frontend/src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-recipe.jpg';
  
  // If it's already a full URL or data URL
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Handle optimized images
  if (imagePath.includes('optimized') || imagePath.includes('?')) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imagePath}`;
  }
  
  // Default case for backend uploads
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imagePath}`;
};