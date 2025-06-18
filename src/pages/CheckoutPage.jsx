import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { img_url } from '../config/api_route';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiPhone, FiMail, FiCreditCard, FiTruck } from 'react-icons/fi';
import noImageFound from '../assets/no_img_found.png';
import API from '../utils/api';

const CheckoutPage = () => {
    const { cart, loading: cartLoading } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [shippingDetails, setShippingDetails] = useState({
        fullName: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        landmark: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login?redirect=checkout');
            return;
        }

        if (!cart?.items || cart.items.length === 0) {
            navigate('/cart');
            return;
        }

        // Fetch active cities
        fetchActiveCities();
    }, [currentUser, cart, navigate]);

    const fetchActiveCities = async () => {
        try {
            const response = await API.get('/cities/active');
            setCities(response.data.data || []);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        const city = cities.find(c => c._id === cityId);
        setSelectedCity(city);
        setShippingDetails(prev => ({
            ...prev,
            city: city?.name || '',
            state: city?.state || ''
        }));
    };

    const validateForm = () => {
        const required = ['fullName', 'email', 'phone', 'address', 'city', 'state'];
        for (const field of required) {
            if (!shippingDetails[field]) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                return false;
            }
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(shippingDetails.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        // Phone validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(shippingDetails.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }

        return true;
    };

    const handleRazorpayPayment = async () => {
        if (!validateForm()) return;

        setIsProcessing(true);
        try {
            const totalAmount = cart.totalAmount + (selectedCity?.deliveryCharge || 0);

            // Here you would typically make an API call to create a Razorpay order
            // For now, we'll simulate the process

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your Razorpay key
                amount: totalAmount * 100, // Amount in paise
                currency: "INR",
                name: "Solar Energy Store",
                description: "Purchase from Solar Energy Store",
                image: "/logo.jpg",
                order_id: "order_" + Date.now(), // This should come from your backend
                handler: function (response) {
                    handleOrderSuccess(response);
                },
                prefill: {
                    name: shippingDetails.fullName,
                    email: shippingDetails.email,
                    contact: shippingDetails.phone
                },
                theme: {
                    color: "#008246"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error('Payment initialization failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCODPayment = async () => {
        if (!validateForm()) return;

        setIsProcessing(true);
        try {
            // Simulate API call for COD order
            await new Promise(resolve => setTimeout(resolve, 2000));
            handleOrderSuccess({ payment_method: 'cod' });
        } catch (error) {
            toast.error('Failed to place COD order');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOrderSuccess = async (paymentResponse) => {
        try {
            // Create order in backend
            const orderData = {
                shippingDetails,
                paymentMethod: paymentResponse.payment_method || 'razorpay',
                transactionId: paymentResponse.razorpay_payment_id || null
            };

            const response = await API.post('/orders', orderData);

            if (response.status === 201) {
                const orderResult = response.data;
                toast.success('Order placed successfully!');

                // Navigate to order success page
                navigate('/order-success', {
                    state: {
                        orderId: orderResult.data.orderId,
                        orderNumber: orderResult.data.orderNumber,
                        paymentMethod: paymentResponse.payment_method || 'razorpay',
                        total: orderResult.data.total
                    }
                });
            } else {
                toast.error('Failed to create order');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(error.response?.data?.message || 'Failed to create order');
        }
    };

    const getProductPrice = (product, productType) => {
        if (productType.startsWith('solar-')) {
            return product.price || 0;
        }
        return product.sellingPrice || product.mrp || 0;
    };

    const getProductMRP = (product, productType) => {
        if (productType.startsWith('solar-')) {
            return null; // Solar products don't have MRP
        }
        return product.mrp || null;
    };

    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) {
            return img_url + product.images[0];
        }
        return img_url + product.image;
    };

    if (cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-28">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Back to Cart
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FiMapPin className="w-5 h-5" />
                                Shipping Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingDetails.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingDetails.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingDetails.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <select
                                        name="city"
                                        value={shippingDetails.city}
                                        onChange={handleCityChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                                    >
                                        <option value="">Select city</option>
                                        {cities.map((city) => (
                                            <option key={city._id} value={city._id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={shippingDetails.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                                        placeholder="Enter state"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Landmark (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={shippingDetails.landmark}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                                        placeholder="Near hospital, school, etc."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={shippingDetails.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                                        placeholder="Enter your complete address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FiCreditCard className="w-5 h-5" />
                                Payment Method
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="razorpay"
                                        checked={paymentMethod === 'razorpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-[#008246] border-gray-300 focus:ring-[#008246]"
                                    />
                                    <div className="ml-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">Pay Online</span>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Pay with credit/debit card, UPI, or net banking</p>
                                    </div>
                                </label>

                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-[#008246] border-gray-300 focus:ring-[#008246]"
                                    />
                                    <div className="ml-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">Cash on Delivery</span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">COD</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                            {/* Order Items */}
                            <div className="space-y-4 mb-6">
                                {cart.items.map((item) => {
                                    const itemPrice = getProductPrice(item.productId, item.productType);
                                    const itemMRP = getProductMRP(item.productId, item.productType);
                                    const totalItemPrice = itemPrice * item.quantity;

                                    return (
                                        <div key={`${item.productType}-${item.productId._id}`} className="flex gap-3">
                                            <img
                                                src={getProductImage(item.productId)}
                                                alt={item.productId.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = noImageFound;
                                                }}
                                            />
                                            <div className="flex-grow">
                                                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                    {item.productId.name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    {itemMRP && itemMRP > itemPrice && (
                                                        <p className="text-sm text-gray-400 line-through">
                                                            ₹{itemMRP.toLocaleString()}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-600">
                                                        Qty: {item.quantity} × ₹{itemPrice.toLocaleString()}
                                                    </p>
                                                </div>
                                                {itemMRP && itemMRP > itemPrice && (
                                                    <p className="text-xs text-green-600 font-medium">
                                                        Save ₹{(itemMRP - itemPrice).toLocaleString()}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    Brand: {item.productId.brand?.name || 'N/A'}
                                                </p>
                                                {/* Product Specifications */}
                                                <div className="mt-1 space-y-0.5">
                                                    {item.productId.modelName && (
                                                        <p className="text-xs text-gray-500">
                                                            Model: {item.productId.modelName}
                                                        </p>
                                                    )}
                                                    {item.productId.capacity && (
                                                        <p className="text-xs text-gray-500">
                                                            Capacity: {item.productId.capacity}VA
                                                        </p>
                                                    )}
                                                    {item.productId.AH && (
                                                        <p className="text-xs text-gray-500">
                                                            Capacity: {item.productId.AH}Ah
                                                        </p>
                                                    )}
                                                    {item.productId.wattage && (
                                                        <p className="text-xs text-gray-500">
                                                            Wattage: {item.productId.wattage}W
                                                        </p>
                                                    )}
                                                    {item.productId.power && (
                                                        <p className="text-xs text-gray-500">
                                                            Power: {item.productId.power}W
                                                        </p>
                                                    )}
                                                    {item.productId.batteryType && (
                                                        <p className="text-xs text-gray-500">
                                                            Type: {item.productId.batteryType}
                                                        </p>
                                                    )}
                                                    {item.productId.warranty && (
                                                        <p className="text-xs text-gray-500">
                                                            Warranty: {item.productId.warranty}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">
                                                    ₹{totalItemPrice.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cart.items.length} items)</span>
                                    <span>₹{cart.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charges</span>
                                    <span className={selectedCity?.deliveryCharge > 0 ? "text-gray-900" : "text-green-600 font-medium"}>
                                        {selectedCity?.deliveryCharge > 0 ? `₹${selectedCity.deliveryCharge.toLocaleString()}` : 'Free'}
                                    </span>
                                </div>
                                {selectedCity && (
                                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                        <div className="flex items-center gap-1">
                                            <FiTruck className="w-3 h-3" />
                                            Estimated delivery: {selectedCity.estimatedDeliveryDays}
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>₹0</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{(cart.totalAmount + (selectedCity?.deliveryCharge || 0)).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Including all taxes</p>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : handleCODPayment}
                                disabled={isProcessing}
                                className="w-full bg-[#008246] text-white font-semibold py-4 rounded-xl text-lg hover:bg-[#005a2f] transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    `Place Order - ₹${(cart.totalAmount + (selectedCity?.deliveryCharge || 0)).toLocaleString()}`
                                )}
                            </button>

                            {/* Security Notice */}
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    🔒 Your payment information is secure and encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage; 