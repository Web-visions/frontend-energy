import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getData, postData } from "../utils/http";

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
        const token = localStorage.getItem("token");

        if (token) {
          const response = await getData("/auth/me");

          if (response) {
            setCurrentUser(response.data);
          } else {
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postData("/auth/register", userData);

      if (response) {
        localStorage.setItem("token", response.token);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;

        setCurrentUser(response.user);

        return {
          success: true,
          needsVerification: !response.user.isEmailVerified,
          otp: response.otp, // This will be undefined in production
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed");
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postData("/auth/login", { email, password });

      if (response) {
        localStorage.setItem("token", response.token);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;

        setCurrentUser(response.user);

        return { success: true };
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (otp) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postData("/auth/verify-email", { otp }, {});

      if (response) {
        setCurrentUser((prev) => ({ ...prev, isEmailVerified: true }));
        return { success: true };
      }
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed");
      return {
        success: false,
        error: error.response?.data?.message || "Verification failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await postData("/auth/resend-otp");

      return { success: response.success, message: response.message };
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError(error.response?.data?.message || "Failed to resend OTP");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to resend OTP",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role) => {
    if (!currentUser) return false;
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    return currentUser.role === role;
  };

  const isAuthenticated = () => {
    return !!currentUser;
  };

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
    isEmailVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
