import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getData } from '../../utils/http';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, Zap } from 'lucide-react';

const ICONS = {
  User: <Users className="w-6 h-6 text-blue-600" />,
  Order: <ShoppingBag className="w-6 h-6 text-green-600" />,
  Review: <DollarSign className="w-6 h-6 text-purple-600" />,
  BulkLead: <DollarSign className="w-6 h-6 text-[#008246]" />,
};

const STAT_KEYS = ['User', 'Order', 'Review', 'BulkLead'];
const ORDER_RANGES = [
  { label: '1 Day', value: '1d' },
  { label: '7 Days', value: '7d' },
  { label: '1 Month', value: '1m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
  { label: '1 Year+', value: 'all' },
];

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderRange, setOrderRange] = useState('7d');
  const [orderGraph, setOrderGraph] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await getData('/admin-stats');
        setStats(res.stats || {});
      } catch (err) {
        setError('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchOrderGraph = async () => {
      setOrderLoading(true);
      try {
        const res = await getData(`/admin-stats/orders-graph`, { range: orderRange });
        setOrderGraph(res.data || []);
      } catch (err) {
        setOrderGraph([]);
      } finally {
        setOrderLoading(false);
      }
    };
    fetchOrderGraph();
  }, [orderRange]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.firstName || 'Admin'}!</p>
      </div>
      {loading ? (
        <div className="text-lg text-gray-500 py-12">Loading stats...</div>
      ) : error ? (
        <div className="text-red-600 py-12">{error}</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {STAT_KEYS.map((key) => (
            <div key={key} className="bg-white rounded-lg shadow p-6 flex items-center border-l-8" style={{ borderColor: '#008246' }}>
              <div className="rounded-full bg-[#008246]/10 p-3 mr-4">
                {ICONS[key] || <Zap className="w-6 h-6 text-[#008246]" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <p className="text-2xl font-bold text-[#008246]">{stats[key] ?? 0}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {/* Order Graph Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h3 className="text-lg font-semibold text-gray-700">Orders Over Time</h3>
          <div>
            <select
              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#008246]"
              value={orderRange}
              onChange={e => setOrderRange(e.target.value)}
            >
              {ORDER_RANGES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
        {orderLoading ? (
          <div className="text-gray-500 py-12 text-center">Loading order data...</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderGraph} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#008246" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;