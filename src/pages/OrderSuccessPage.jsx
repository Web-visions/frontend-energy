import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiHome, FiShoppingBag } from 'react-icons/fi';
import InvoiceDownload from '../Components/InvoiceDownload';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId, orderNumber, paymentMethod, total } = location.state || {};

    return (
        <div className="min-h-screen bg-gray-50  mt-28 flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Order Placed Successfully!
                    </h1>

                    <p className="text-gray-600 mb-8">
                        Thank you for your purchase. We've received your order and will process it shortly.
                    </p>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
                        <div className="space-y-3 text-left">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order Number:</span>
                                <span className="font-medium text-gray-900">{orderNumber || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium text-gray-900 capitalize">
                                    {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-medium text-gray-900">₹{total?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-medium text-green-600">Confirmed</span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
                        <div className="space-y-3 text-left">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-700">
                                    You'll receive an order confirmation email shortly
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-700">
                                    Our team will review your order and contact you within 24 hours
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-700">
                                    {paymentMethod === 'cod'
                                        ? 'Payment will be collected upon delivery'
                                        : 'Payment has been processed successfully'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Download */}
                    {orderId && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice</h3>
                            <InvoiceDownload
                                orderId={orderId}
                                orderNumber={orderNumber}
                                className="justify-center"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-[#008246] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#005a2f] transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <FiHome className="w-5 h-5" />
                            Back to Home
                        </button>

                        <button
                            onClick={() => navigate('/products')}
                            className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <FiShoppingBag className="w-5 h-5" />
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage; 