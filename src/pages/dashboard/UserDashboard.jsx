import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  
  // Sample data for charts
  const energyData = [
    { name: 'Jan', consumption: 400 },
    { name: 'Feb', consumption: 300 },
    { name: 'Mar', consumption: 200 },
    { name: 'Apr', consumption: 278 },
    { name: 'May', consumption: 189 },
    { name: 'Jun', consumption: 239 },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {currentUser?.firstName || 'User'}!</h1>
        <p className="text-gray-600">Here's an overview of your energy consumption</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Consumption</h3>
          <p className="text-3xl font-bold text-blue-600">1,245 kWh</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Solar Generation</h3>
          <p className="text-3xl font-bold text-green-600">876 kWh</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Grid Usage</h3>
          <p className="text-3xl font-bold text-orange-600">369 kWh</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Energy Consumption History</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={energyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="consumption" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h3>
          {[1, 2, 3].map((item) => (
            <div key={item} className="border-b border-gray-200 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{Math.floor(Math.random() * 10000)}</p>
                  <p className="text-sm text-gray-500">Solar Panel Installation</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">$1,299.00</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Notifications</h3>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border-b border-gray-200 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
              <p className="font-medium">System Maintenance</p>
              <p className="text-sm text-gray-500">Scheduled maintenance on June 15th</p>
              <p className="text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;