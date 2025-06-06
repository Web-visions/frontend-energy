import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || ''
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // For password change form
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, reset: resetPassword, watch: watchPassword } = useForm();
  const newPassword = watchPassword('newPassword');
  
  const onSubmitProfile = async (data) => {
    setIsSubmitting(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setMessage('Profile updated successfully!');
        // Update local user data if needed
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating profile');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmitPassword = async (data) => {
    setIsSubmitting(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setMessage('Password changed successfully!');
        resetPassword();
      } else {
        setError(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while changing password');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-600">Manage your account information and settings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Security
            </button>
          </nav>
        </div>
        
        <div className="p-6">
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
          
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit(onSubmitProfile)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('firstName', { 
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      }
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('lastName', { 
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters'
                      }
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                  disabled
                  {...register('email')}
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                      message: 'Invalid phone number format'
                    }
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'security' && (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <div className="mb-6">
                <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  className={`w-full px-3 py-2 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerPassword('currentPassword', { 
                    required: 'Current password is required'
                  })}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className={`w-full px-3 py-2 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerPassword('newPassword', { 
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`w-full px-3 py-2 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerPassword('confirmPassword', { 
                    required: 'Please confirm your new password',
                    validate: value => value === newPassword || 'Passwords do not match'
                  })}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
                >
                  {isSubmitting ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;