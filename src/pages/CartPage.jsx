import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cart, loading, error, updateCartItem, removeFromCart } = useCart();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/')}
                    className="bg-[#008246] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#005a2f] transition-colors duration-200"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-28">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={`${item.productType}-${item.productId}`}
                                className="bg-white rounded-xl shadow-lg p-6 flex gap-6"
                            >
                                {/* Product Image */}
                                <div className="w-32 h-32 flex-shrink-0">
                                    <img
                                        src={item.productId.image}
                                        alt={item.productId.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {item.productId.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {item.productType.charAt(0).toUpperCase() + item.productType.slice(1)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.productType, item.productId._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => updateCartItem(item.productType, item.productId._id, Math.max(1, item.quantity - 1))}
                                                className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-2 border-x border-gray-300">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateCartItem(item.productType, item.productId._id, item.quantity + 1)}
                                                className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            ₹{((item.productId.sellingPrice || item.productId.mrp) * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cart.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{cart.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-[#008246] text-white font-semibold py-3 rounded-lg mt-6 hover:bg-[#005a2f] transition-colors duration-200"
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg mt-4 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 