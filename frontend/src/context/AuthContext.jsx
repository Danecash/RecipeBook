// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { 
  login as apiLogin, 
  register as apiRegister,
  getCurrentUser
} from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getCurrentUser();
          if (response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await apiLogin(credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         'Login failed. Please try again.';
      setError(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await apiRegister(userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         'Registration failed. Please try again.';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      error,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};