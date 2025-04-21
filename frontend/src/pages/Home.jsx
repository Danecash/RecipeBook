import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { fetchRecentRecipes, fetchPopularIngredients } from '../services/api';
import RecipeList from '../components/RecipeList';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [popularIngredients, setPopularIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesResponse, ingredientsResponse] = await Promise.all([
          fetchRecentRecipes(7), // Last 7 days
          fetchPopularIngredients()
        ]);
        
        setRecentRecipes(recipesResponse.data);
        setPopularIngredients(ingredientsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFavoriteToggle = (recipeId) => {
    setRecentRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe._id === recipeId ? { ...recipe, favorite: !recipe.favorite } : recipe
      )
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Recipe Finder
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Discover, create, and share your favorite recipes
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <SearchBar />
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          Recently Added Recipes
        </Typography>
        <RecipeList 
          recipes={recentRecipes} 
          loading={loading} 
          onFavoriteToggle={handleFavoriteToggle} 
        />
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" href="/recipes" size="large">
            View All Recipes
          </Button>
        </Box>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          Popular Ingredients
        </Typography>
        <Grid container spacing={2}>
          {popularIngredients.map((ingredient, index) => (
            <Grid item key={index}>
              <Button variant="contained" color="secondary">
                {ingredient.ingredient} ({ingredient.count})
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;