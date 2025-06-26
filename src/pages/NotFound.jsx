import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 px-4">
            <div className="text-8xl font-extrabold text-[#008246] drop-shadow-lg mb-4">404</div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Page Not Found</div>
            <div className="text-gray-500 mb-8 text-center max-w-md">
                Oops! The page you are looking for does not exist or has been moved.<br />
                Please check the URL or return to the homepage.
            </div>
            <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#008246] text-white rounded-full font-semibold shadow hover:bg-[#005a2f] transition-all text-lg"
            >
                Go to Home
            </button>
        </div>
    );
} 