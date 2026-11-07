import React, { createContext, useState, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // REGISTER
  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post('/api/auth/register', {
        name,
        email,
        password,
        role,
      });

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post('/api/auth/login', {
        email,
        password,
      });

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  // UPDATE USER
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isEmployer: user?.role === 'employer',
    isJobSeeker: user?.role === 'jobseeker',
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;