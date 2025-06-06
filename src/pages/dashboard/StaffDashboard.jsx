import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

const StaffDashboard = () => {
  const { currentUser } = useAuth();
  
  // Sample data for charts
  const orderData = [
    { name: 'Jan', completed: 40, pending: 24 },
    { name: 'Feb', completed: 30, pending: 13 },
    { name: 'Mar', completed: 20, pending: 98 },
    { name: 'Apr', completed: 27, pending: 39 },
    { name: 'May', completed: 18, pending: 48 },
    { name: 'Jun', completed: 23, pending: 38 },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.firstName || 'Staff'}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
            <p className="text-2xl font-bold text-blue-600">845</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Completed Orders</h3>
            <p className="text-2xl font-bold text-green-600">156</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-600">28</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Status</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={orderData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#82ca9d" />
              <Bar dataKey="pending" stackId="a" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{Math.floor(Math.random() * 10000)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Customer {item}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item % 3 === 0 ? 'bg-green-100 text-green-800' : item % 2 === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {item % 3 === 0 ? 'Completed' : item % 2 === 0 ? 'Pending' : 'Processing'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(Math.random() * 1000).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Messages</h3>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border-b border-gray-200 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Customer {item}</p>
                  <p className="text-sm text-gray-500 mt-1">I have a question about my solar panel installation...</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item % 2 === 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  {item % 2 === 0 ? 'Urgent' : 'New'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;