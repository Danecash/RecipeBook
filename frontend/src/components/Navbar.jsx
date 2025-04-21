import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Favorite, Search, Add, MenuBook } from '@mui/icons-material';
import { fetchFavorites } from '../services/api';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const response = await fetchFavorites();
        setFavoriteCount(response.data.count);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    getFavorites();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuBook sx={{ mr: 1 }} />
            Recipe Finder
          </Box>
        </Typography>
        
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
          <Button color="inherit" startIcon={<Home />} component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" startIcon={<MenuBook />} component={Link} to="/recipes">
            All Recipes
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Favorite />} 
            component={Link} 
            to="/favorites"
          >
            <Badge badgeContent={favoriteCount} color="secondary" sx={{ mr: 1 }}>
              Favorites
            </Badge>
          </Button>
          <Button color="inherit" startIcon={<Add />} component={Link} to="/add-recipe">
            Add Recipe
          </Button>
        </Box>

        <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
          <IconButton color="inherit" onClick={() => navigate('/')}>
            <Home />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/recipes')}>
            <MenuBook />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/favorites')}>
            <Badge badgeContent={favoriteCount} color="secondary">
              <Favorite />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/add-recipe')}>
            <Add />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;