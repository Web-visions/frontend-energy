import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { postData } from '../utils/http';

const BulkOrderPage = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            await postData('/bulk-orders', form);
            setSuccess(true);
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
                {/* Left Info */}
                <div className="bg-[#008246] text-white p-8 flex-1 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-2">Energy Solar System Bulk Purchase</h2>
                    <p className="mb-4">Get exclusive discounts and offers on bulk orders for solar products. Fill the form to get a custom quote.</p>
                    <div className="font-semibold mb-2">To know more, call: <a href="tel:+918929490346" className="underline">+91-8929490346</a></div>
                </div>
                {/* Right Form */}
                <form className="flex-1 p-8 flex flex-col gap-4" onSubmit={handleSubmit}>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Bulk Order Inquiry</h3>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="border rounded px-3 py-2 focus:ring-2 focus:ring-[#008246]"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        className="border rounded px-3 py-2 focus:ring-2 focus:ring-[#008246]"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="border rounded px-3 py-2 focus:ring-2 focus:ring-[#008246]"
                        required
                    />
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Message / Product details / Quantity"
                        className="border rounded px-3 py-2 focus:ring-2 focus:ring-[#008246] min-h-[80px]"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-[#008246] text-white font-semibold py-2 rounded hover:bg-[#009c55] transition"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    {success && <div className="text-green-600 font-semibold">Thank you! We will contact you soon.</div>}
                </form>
            </div>
        </div>
    );
};

export default BulkOrderPage; 