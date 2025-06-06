import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    serviceAlerts: true,
    billingAlerts: true
  });
  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    highContrast: false,
    fontSize: 'medium',
    language: 'english'
  });
  const [message, setMessage] = useState('');
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  const handleDisplayChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDisplaySettings({
      ...displaySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const saveNotificationSettings = () => {
    // Here you would typically make an API call to save the settings
    console.log('Saving notification settings:', notificationSettings);
    setMessage('Notification preferences saved successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  const saveDisplaySettings = () => {
    // Here you would typically make an API call to save the settings
    console.log('Saving display settings:', displaySettings);
    setMessage('Display preferences saved successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Notification Preferences
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'display' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Display Preferences
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('system')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'system' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                System Settings
              </button>
            )}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
              <p className="text-gray-600 mb-6">Choose how you want to receive notifications and updates</p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email Notifications</label>
                    <p className="text-gray-500">Receive notifications via email</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="smsNotifications"
                      name="smsNotifications"
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={handleNotificationChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="smsNotifications" className="font-medium text-gray-700">SMS Notifications</label>
                    <p className="text-gray-500">Receive notifications via text message</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketingEmails"
                      name="marketingEmails"
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={handleNotificationChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="marketingEmails" className="font-medium text-gray-700">Marketing Emails</label>
                    <p className="text-gray-500">Receive promotional emails and offers</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="orderUpdates"
                      name="orderUpdates"
                      type="checkbox"
                      checked={notificationSettings.orderUpdates}
                      onChange={handleNotificationChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="orderUpdates" className="font-medium text-gray-700">Order Updates</label>
                    <p className="text-gray-500">Receive updates about your orders</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="serviceAlerts"
                      name="serviceAlerts"
                      type="checkbox"
                      checked={notificationSettings.serviceAlerts}
                      onChange={handleNotificationChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="serviceAlerts" className="font-medium text-gray-700">Service Alerts</label>
                    <p className="text-gray-500">Receive alerts about your solar system</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="billingAlerts"
                      name="billingAlerts"
                      type="checkbox"
                      checked={notificationSettings.billingAlerts}
                      onChange={handleNotificationChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="billingAlerts" className="font-medium text-gray-700">Billing Alerts</label>
                    <p className="text-gray-500">Receive alerts about your billing and payments</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={saveNotificationSettings}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'display' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Display Preferences</h2>
              <p className="text-gray-600 mb-6">Customize how the application looks and feels</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Theme</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="darkMode"
                          name="darkMode"
                          type="checkbox"
                          checked={displaySettings.darkMode}
                          onChange={handleDisplayChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="darkMode" className="font-medium text-gray-700">Dark Mode</label>
                        <p className="text-gray-500">Use dark theme for the application</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="highContrast"
                          name="highContrast"
                          type="checkbox"
                          checked={displaySettings.highContrast}
                          onChange={handleDisplayChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="highContrast" className="font-medium text-gray-700">High Contrast</label>
                        <p className="text-gray-500">Increase contrast for better visibility</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Text Size</h3>
                  <select
                    id="fontSize"
                    name="fontSize"
                    value={displaySettings.fontSize}
                    onChange={handleDisplayChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="x-large">Extra Large</option>
                  </select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Language</h3>
                  <select
                    id="language"
                    name="language"
                    value={displaySettings.language}
                    onChange={handleDisplayChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="chinese">Chinese</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={saveDisplaySettings}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'system' && currentUser?.role === 'admin' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">System Settings</h2>
              <p className="text-gray-600 mb-6">Configure system-wide settings (Admin only)</p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      System settings are currently under development. This feature will be available soon.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="opacity-50 pointer-events-none">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Maintenance Mode
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" name="toggle" id="maintenance" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" disabled />
                    <label htmlFor="maintenance" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                  <span className="text-gray-700">Disabled</span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    System Email
                  </label>
                  <input
                    type="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="system@example.com"
                    disabled
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Backup Frequency
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                
                <button
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
                  disabled
                >
                  Save System Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;