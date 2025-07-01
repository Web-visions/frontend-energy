import React from "react";
import { Link } from "react-router-dom";

const Sitemap = () => (
    <main className="bg-gray-50 min-h-screen py-16 mt-20">
        <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-4xl font-bold text-[#008246] mb-8 text-center">Site Map</h1>
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <ul className="space-y-4 text-lg">
                    <li><Link to="/" className="text-[#008246] hover:underline">Home</Link></li>
                    <li><Link to="/about" className="text-[#008246] hover:underline">About Us</Link></li>
                    <li><Link to="/products" className="text-[#008246] hover:underline">Products</Link></li>
                    <li><Link to="/services" className="text-[#008246] hover:underline">Services</Link></li>
                    <li><Link to="/cart" className="text-[#008246] hover:underline">Cart</Link></li>
                    <li><Link to="/checkout" className="text-[#008246] hover:underline">Checkout</Link></li>
                    <li><Link to="/faq" className="text-[#008246] hover:underline">FAQ</Link></li>
                    <li><Link to="/contact" className="text-[#008246] hover:underline">Contact</Link></li>
                    <li><Link to="/login" className="text-[#008246] hover:underline">Login</Link></li>
                    <li><Link to="/signup" className="text-[#008246] hover:underline">Sign Up</Link></li>
                </ul>
            </div>
        </div>
    </main>
);

export default Sitemap; 