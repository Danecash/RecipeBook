import { Grid, Container, CircularProgress, Typography } from '@mui/material';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, loading, onFavoriteToggle }) => {
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">No recipes found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {recipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <RecipeCard recipe={recipe} onFavoriteToggle={onFavoriteToggle} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecipeList;