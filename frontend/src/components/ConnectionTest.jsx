import { useEffect } from 'react';
import { fetchRecipes } from '../services/api';

export default function ConnectionTest() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetchRecipes();
        console.log('Connection successful!', response.data);
      } catch (error) {
        console.error('Connection failed:', error);
      }
    };
    testConnection();
  }, []);

  return null;
}