import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { putData } from '../../utils/http';

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await putData('/users/user-profile', formData);
      setCurrentUser(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || ''
    });
    setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await putData('/auth/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully!');
      e.target.reset();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-600">Manage your account information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit className="mr-2" />
                Edit
              </button>
            )}
          </div>

          {loading && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              Loading...
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <FiSave className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <FiUser className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{currentUser?.name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FiMail className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{currentUser?.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FiPhone className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{currentUser?.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiMapPin className="text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{currentUser?.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>

          <form onSubmit={handleChangePassword}>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minLength="6"
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;