import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getData, postData } from '../utils/http';

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
          const response = await getData('/auth/me');

          if (response) {
            setCurrentUser(response.data);
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

      const response = await postData('/auth/register', userData);

      if (response) {
        // Store token
        localStorage.setItem('token', response.token);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

        // Set user data
        setCurrentUser(response.user);

        // Return success with verification status and OTP if available (for testing)
        return {
          success: true,
          needsVerification: !response.user.isEmailVerified,
          otp: response.otp // This will be undefined in production
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.message || 'Registration failed');
      return { success: false, error: error.response?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postData('/auth/login', { email, password });

      if (response) {
        // Store token
        localStorage.setItem('token', response.token);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

        // Set user data
        setCurrentUser(response.user);

        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.message || 'Login failed');
      return { success: false, error: error.response?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Verify email with OTP
  const verifyEmail = async (otp) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/auth/verify-email', { otp }, {
      });

      if (response) {
        setCurrentUser(prev => ({ ...prev, isEmailVerified: true }));
        return { success: true };
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError(error.response?.message || 'Verification failed');
      return { success: false, error: error.response?.message || 'Verification failed' };
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/auth/resend-otp');

      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error.response?.message || 'Failed to resend OTP');
      return { success: false, error: error.response?.message || 'Failed to resend OTP' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);



      localStorage.removeItem('token');
      window.location.href = "/login"

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