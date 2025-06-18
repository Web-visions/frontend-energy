import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiDownload, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import InvoiceDownload from '../../Components/InvoiceDownload';
import { getData, postData, putData, deleteData } from '../../utils/http';
import OrderDetailsModal from './OrderDetailsModal';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, filters]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            });

            const data = await getData(`/orders?${params}`);

            setOrders(data.data || []);
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total,
                totalPages: data.pagination.pages
            }));
        } catch (error) {
            toast.error('Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await putData(`/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated successfully');
            fetchOrders();
        } catch (error) {
            toast.error('Error updating order status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: FiPackage,
            confirmed: FiCheckCircle,
            processing: FiPackage,
            shipped: FiTruck,
            delivered: FiCheckCircle,
            cancelled: FiXCircle
        };
        return icons[status] || FiPackage;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleViewOrder = async (orderId) => {
        try {
            const data = await getData(`/orders/details/${orderId}`);
            setSelectedOrder(data.data);
            setShowOrderModal(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Error fetching order details');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
                <p className="text-gray-600">Manage customer orders and track delivery status</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search by order number, customer name..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ status: 'all', search: '' })}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Orders</h3>
                </div>

                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008246] mx-auto"></div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => {
                                        const StatusIcon = getStatusIcon(order.status);
                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {order.orderNumber}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {order.paymentDetails.method.toUpperCase()}
                                                        </div>
                                                        {order.paymentDetails.transactionId && (
                                                            <div className="text-xs text-gray-400">
                                                                TXN: {order.paymentDetails.transactionId}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {order.shippingDetails.fullName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {order.shippingDetails.email}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {order.shippingDetails.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.items.map(item => item.productId?.name).slice(0, 2).join(', ')}
                                                        {order.items.length > 2 && '...'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(order.pricing.total)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        className={`text-sm px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewOrder(order._id)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center"
                                                        >
                                                            <FiEye className="mr-1" />
                                                            View
                                                        </button>
                                                        <InvoiceDownload
                                                            orderId={order._id}
                                                            orderNumber={order.orderNumber}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                        {pagination.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page === 1}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowOrderModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
};

export default OrderManagement; 