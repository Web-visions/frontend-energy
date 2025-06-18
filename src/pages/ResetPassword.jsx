import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import API from '../utils/api';

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { resettoken } = useParams();
  const password = watch('password');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await API.put(`/auth/reset-password/${resettoken}`, {
        password: formData.password
      });

      if (response.status === 200) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error('Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        <p className="text-gray-600 mb-6 text-center">
          Enter your new password below.
        </p>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter new password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }
              })}
              onChange={(e) => {
                handleInputChange(e);
                register(e);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-gray-500 ml-2"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Confirm new password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              onChange={(e) => {
                handleInputChange(e);
                register(e);
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-sm text-gray-500 ml-2"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="mb-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;