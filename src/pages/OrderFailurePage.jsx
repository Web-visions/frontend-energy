import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderFailurePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const error = location.state;

    useEffect(() => {
        if (!error) {
            navigate('/');
        }
    }, [error, navigate]);

    if (!error) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-yellow-50 px-4 pt-32 pb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
                <div className="text-5xl mb-4 text-red-500">😢</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Failed</h1>
                <p className="text-gray-600 mb-6">Sorry, your order could not be completed.</p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                    <div className="mb-2"><span className="font-semibold">Reason:</span> {error.message || 'Unknown error'}</div>
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
} 