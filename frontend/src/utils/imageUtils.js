// frontend/src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-recipe.jpg';
  
  // If it's already a full URL or data URL
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Handle optimized images
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imagePath}`;
};

export const imageStyle = {
  width: '100%',
  height: '200px', // Fixed height for consistency
  objectFit: 'cover', // Ensures images fill the space without distortion
  borderRadius: '8px' // Optional: for rounded corners
};