import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { toggleFavorite } from '../services/api';
import { toast } from 'react-toastify';

const RecipeCard = ({ recipe, onFavoriteToggle }) => {
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    try {
      await toggleFavorite(recipe._id);
      onFavoriteToggle(recipe._id);
      toast.success(recipe.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/recipes/${recipe._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardMedia
          component="img"
          height="140"
          image={recipe.image || '/placeholder-recipe.jpg'}
          alt={recipe.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {recipe.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recipe.category}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2">
              {recipe.ingredients.length} ingredients
            </Typography>
            <IconButton onClick={handleFavoriteClick} aria-label="favorite">
              {recipe.favorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
};

export default RecipeCard;