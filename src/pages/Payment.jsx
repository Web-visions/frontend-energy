import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, MapPin, Phone, User, Home, Navigation } from 'lucide-react';
import API from '../utils/api';

const Payment = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    altMobile: '',
    address: '',
    city: '',
    landmark: '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    // Fetch active cities
    fetchActiveCities();
  }, []);

  const fetchActiveCities = async () => {
    try {
      const response = await API.get('/cities/active');
      setCities(response.data.data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const city = cities.find(c => c._id === cityId);
    setSelectedCity(city);
    setFormData(prev => ({
      ...prev,
      city: city?.name || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'cod') {
      alert('Order placed successfully!');
    } else {
      const options = {
        key: "YOUR_RAZORPAY_KEY",
        amount: 50000,
        currency: "INR",
        name: "Energy Storage System",
        description: "Battery Purchase",
        image: "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg",
        handler: function (response) {
          alert("Payment Successful! ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          contact: formData.mobile
        },
        theme: {
          color: "#008246"
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#008246] focus:ring-1 focus:ring-[#008246] outline-none transition-all placeholder:text-gray-400";
  const labelClasses = "flex items-center gap-2 text-gray-700 font-medium mb-2";

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#008246] flex items-center justify-center">
            <CreditCard size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Secure Checkout</h1>
            <p className="text-gray-500">Complete your order with our secure checkout</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <User size={20} />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={inputClasses}
                  placeholder="John"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={inputClasses}
                  placeholder="Doe"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Phone size={20} />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  className={inputClasses}
                  placeholder="+91 98765 43210"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Alternate Number</label>
                <input
                  type="tel"
                  name="altMobile"
                  className={inputClasses}
                  placeholder="+91 98765 43210"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Truck size={20} />
              Delivery Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className={labelClasses}>
                  <Home size={18} />
                  Full Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  className={inputClasses}
                  placeholder="Enter your complete address"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>
                    <MapPin size={18} />
                    City
                  </label>
                  <select
                    name="city"
                    className={inputClasses}
                    value={formData.city}
                    onChange={handleCityChange}
                    required
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClasses}>
                  <Navigation size={18} />
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  className={inputClasses}
                  placeholder="Enter a nearby landmark"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <CreditCard size={20} />
              Payment Method
            </h2>
            <div className="space-y-4">
              {['cod', 'online'].map((method) => (
                <label
                  key={method}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.paymentMethod === method
                    ? 'border-[#008246] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#008246]"
                  />
                  <span className="ml-3 font-medium">
                    {method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#008246] text-white font-semibold rounded-xl hover:bg-[#006a38] transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            {formData.paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;