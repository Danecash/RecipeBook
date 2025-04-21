import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeById, addReview } from '../services/api';
import { Box, Typography, Paper, TextField, Button, Rating, Chip, Divider, IconButton, CircularProgress } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { toggleFavorite } from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetchRecipeById(id);
        setRecipe(response.data);
      } catch (error) {
        toast.error('Failed to fetch recipe details');
      } finally {
        setLoading(false);
      }
    };

    getRecipe();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview(id, review);
      const updatedRecipe = await fetchRecipeById(id);
      setRecipe(updatedRecipe.data);
      setReview({ rating: 5, comment: '' });
      toast.success('Review added successfully');
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      await toggleFavorite(id);
      const updatedRecipe = await fetchRecipeById(id);
      setRecipe(updatedRecipe.data);
      toast.success(updatedRecipe.data.favorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
        Recipe not found
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" component="h1">
          {recipe.name}
        </Typography>
        <IconButton onClick={handleFavoriteToggle} size="large">
          {recipe.favorite ? <Favorite color="error" fontSize="large" /> : <FavoriteBorder fontSize="large" />}
        </IconButton>
      </Box>

      <Chip label={recipe.category} color="primary" sx={{ mb: 3 }} />

      {recipe.image && (
        <Box sx={{ mb: 3 }}>
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} 
          />
        </Box>
      )}

      {recipe.description && (
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          {recipe.description}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
        {recipe.prepTime && (
          <Typography variant="body1">
            <strong>Prep Time:</strong> {recipe.prepTime}
          </Typography>
        )}
        {recipe.cookTime && (
          <Typography variant="body1">
            <strong>Cook Time:</strong> {recipe.cookTime}
          </Typography>
        )}
        {recipe.servings && (
          <Typography variant="body1">
            <strong>Servings:</strong> {recipe.servings}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ingredients
        </Typography>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              <Typography variant="body1">{ingredient}</Typography>
            </li>
          ))}
        </ul>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Instructions
        </Typography>
        <ol>
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>
              <Typography variant="body1">{instruction}</Typography>
            </li>
          ))}
        </ol>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>
        {recipe.reviews && recipe.reviews.length > 0 ? (
          recipe.reviews.map((review, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={review.rating} readOnly precision={0.5} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {new Date(review.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography variant="body1">{review.comment}</Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body1">No reviews yet</Typography>
        )}
      </Box>

      <Box component="form" onSubmit={handleReviewSubmit}>
        <Typography variant="h6" gutterBottom>
          Add Your Review
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Rating
            value={review.rating}
            onChange={(e, newValue) => setReview({ ...review, rating: newValue })}
            precision={0.5}
          />
        </Box>
        <TextField
          label="Your Review"
          multiline
          rows={4}
          fullWidth
          value={review.comment}
          onChange={(e) => setReview({ ...review, comment: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained">
          Submit Review
        </Button>
      </Box>
    </Container>
  );
};

export default RecipeDetail;