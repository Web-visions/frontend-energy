import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiHome, FiShoppingBag } from 'react-icons/fi';
import InvoiceDownload from '../Components/InvoiceDownload';

const OrderSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state;

    useEffect(() => {
        if (!order) {
            navigate('/');
        }
    }, [order, navigate]);

    if (!order) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 px-4 pt-32 pb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
                <div className="text-5xl mb-4 text-green-600">🎉</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been placed and is being processed.</p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                    <div className="mb-2"><span className="font-semibold">Order Number:</span> {order.orderNumber}</div>
                    <div className="mb-2"><span className="font-semibold">Payment Method:</span> {order.paymentMethod?.toUpperCase()}</div>
                    <div className="mb-2"><span className="font-semibold">Total:</span> ₹{order.total?.toLocaleString()}</div>
                    {order.deliveryCharge !== undefined && (
                        <div className="mb-2"><span className="font-semibold">Delivery Charge:</span> ₹{order.deliveryCharge?.toLocaleString()}</div>
                    )}
                </div>
                        <button
                            onClick={() => navigate('/')}
                    className="mt-4 px-6 py-3 bg-[#008246] text-white rounded-full font-semibold shadow hover:bg-[#005a2f] transition-all text-lg"
                >
                    Go to Home
                        </button>
            </div>
        </div>
    );
};

export default OrderSuccessPage; 