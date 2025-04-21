import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipes, fetchByCategory, fetchPaginatedRecipes } from '../services/api';
import RecipeList from '../components/RecipeList';
import { Container, Typography, Box, Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AllRecipes = () => {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState('-createdAt');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        if (category) {
          response = await fetchByCategory(category);
          setRecipes(response.data);
        } else {
          response = await fetchPaginatedRecipes(page, limit, sort, category);
          setRecipes(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, page, limit, sort]);

  const handleFavoriteToggle = (recipeId) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe._id === recipeId ? { ...recipe, favorite: !recipe.favorite } : recipe
      )
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {category ? `${category} Recipes` : 'All Recipes'}
        </Typography>
        
        {!category && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sort}
                label="Sort By"
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="-createdAt">Newest First</MenuItem>
                <MenuItem value="createdAt">Oldest First</MenuItem>
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="-name">Name (Z-A)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Items Per Page</InputLabel>
              <Select
                value={limit}
                label="Items Per Page"
                onChange={(e) => setLimit(e.target.value)}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        <RecipeList 
          recipes={recipes} 
          loading={loading} 
          onFavoriteToggle={handleFavoriteToggle} 
        />

        {!category && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AllRecipes;