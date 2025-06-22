import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');


        if (token) {
          console.log('Token inside:', token);
          // Set default auth header for axios

          // Fetch current user data
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.success) {
            setCurrentUser(response.data.data);
          } else {
            // If token is invalid, clear it
            // localStorage.removeItem('token');
            // delete axios.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // localStorage.removeItem('token');
        // delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/auth/register', userData);

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.token);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // Set user data
        setCurrentUser(response.data.user);

        // Return success with verification status and OTP if available (for testing)
        return {
          success: true,
          needsVerification: !response.data.user.isEmailVerified,
          otp: response.data.otp // This will be undefined in production
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.token);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // Set user data
        setCurrentUser(response.data.user);

        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Verify email with OTP
  const verifyEmail = async (otp) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/auth/verify-email', { otp }, {
      });

      if (response.data.success) {
        setCurrentUser(prev => ({ ...prev, isEmailVerified: true }));
        return { success: true };
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError(error.response?.data?.message || 'Verification failed');
      return { success: false, error: error.response?.data?.message || 'Verification failed' };
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/auth/resend-otp');

      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error.response?.data?.message || 'Failed to resend OTP');
      return { success: false, error: error.response?.data?.message || 'Failed to resend OTP' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);



      localStorage.removeItem('token');

    } catch (error) {

      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!currentUser) return false;
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    return currentUser.role === role;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Check if email is verified
  const isEmailVerified = () => {
    return currentUser?.isEmailVerified || false;
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    register,
    login,
    logout,
    verifyEmail,
    resendOTP,
    hasRole,
    isAuthenticated,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};