//backend/utils/helpers.js

function formatRecipeImage(recipe) {
  return {
    ...recipe,
    image: recipe.imageOptimized || recipe.image
  };
}

function serverError(error) {
  return {
    error: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && {
      details: error.message,
      stack: error.stack
    })
  };
}

module.exports = { formatRecipeImage, serverError };