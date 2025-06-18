import React from 'react';
import { FaTimes, FaDownload, FaUser, FaMapMarkerAlt, FaCreditCard, FaBox } from 'react-icons/fa';
import { getData } from '../../utils/http';

const OrderDetailsModal = ({ order, onClose }) => {
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

    const handleDownloadInvoice = async () => {
        try {
            const response = await getData(`/invoice/download/${order.orderNumber}`, null, {
                responseType: 'blob'
            });

            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${order.orderNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                        <p className="text-gray-600">Order #{order.orderNumber}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleDownloadInvoice}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <FaDownload className="mr-2" />
                            Download Invoice
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <FaBox className="text-blue-600 mr-2" />
                                <h3 className="font-semibold text-gray-800">Order Info</h3>
                            </div>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Order Number:</span> {order.orderNumber}</p>
                                <p><span className="font-medium">Date:</span> {formatDate(order.createdAt)}</p>
                                <p><span className="font-medium">Status:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </p>
                                <p><span className="font-medium">Items:</span> {order.items.length}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <FaUser className="text-green-600 mr-2" />
                                <h3 className="font-semibold text-gray-800">Customer Info</h3>
                            </div>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Name:</span> {order.shippingDetails.fullName}</p>
                                <p><span className="font-medium">Email:</span> {order.shippingDetails.email}</p>
                                <p><span className="font-medium">Phone:</span> {order.shippingDetails.phone}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <FaCreditCard className="text-purple-600 mr-2" />
                                <h3 className="font-semibold text-gray-800">Payment Info</h3>
                            </div>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Method:</span> {order.paymentDetails.method.toUpperCase()}</p>
                                <p><span className="font-medium">Status:</span> {order.paymentDetails.status}</p>
                                {order.paymentDetails.transactionId && (
                                    <p><span className="font-medium">Transaction ID:</span> {order.paymentDetails.transactionId}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <FaMapMarkerAlt className="text-red-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium">{order.shippingDetails.fullName}</p>
                            <p>{order.shippingDetails.address}</p>
                            {order.shippingDetails.landmark && <p>Landmark: {order.shippingDetails.landmark}</p>}
                            <p>{order.shippingDetails.city}, {order.shippingDetails.state}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Unit Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {item.productId?.image && (
                                                        <img
                                                            className="h-10 w-10 rounded-lg object-cover mr-3"
                                                            src={item.productId.image}
                                                            alt={item.productId.name}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.productId?.name || 'Product Name Not Available'}
                                                        </div>
                                                        {item.productId?.brand?.name && (
                                                            <div className="text-sm text-gray-500">
                                                                Brand: {item.productId.brand.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {item.productType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(item.totalPrice)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(order.pricing.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Charges:</span>
                                <span className="font-medium">
                                    {order.pricing.deliveryCharge === 0 ? 'Free' : formatCurrency(order.pricing.deliveryCharge)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax:</span>
                                <span className="font-medium">{formatCurrency(order.pricing.tax)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                                <span>Total Amount:</span>
                                <span>{formatCurrency(order.pricing.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal; 