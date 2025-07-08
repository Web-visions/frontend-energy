import React from "react";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/ESS+Solar+Energy/@23.2599,77.4126,17z"; // Replace with actual location if needed

const GoogleRatingBadge = () => (
    <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Google Rating on Maps"
        className="fixed bottom-6 left-24 z-50 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 transition-all duration-200 hover:shadow-xl group"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)' }}
    >
        {/* Google logo circle with star */}
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 via-yellow-400 to-red-500 mr-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#fff" />
                <path d="M12 6l1.76 3.57L18 10.09l-2.88 2.81L15.52 18 12 15.77 8.48 18l.88-5.1L6 10.09l4.24-.52L12 6z" fill="#34A853" />
            </svg>
        </span>
        <div className="flex flex-col justify-center">
            <span className="text-xs text-gray-700 font-semibold leading-none">Google Rating</span>
            <span className="flex items-center">
                <span className="text-xl font-bold text-orange-500 mr-1">4.7</span>
                {/* 4.5 stars */}
                <span className="flex items-center">
                    {[...Array(4)].map((_, i) => (
                        <svg key={i} width="16" height="16" fill="#FFA726" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    ))}
                    {/* Half star */}
                    <svg width="16" height="16" fill="#FFA726" viewBox="0 0 24 24"><path d="M12 15.4V5.6l1.71 3.47 3.82.33-2.93 2.53.87 3.73z" /><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03L12 17.27V15.4z" fill="#E0E0E0" /></svg>
                </span>
            </span>
        </div>
    </a>
);

export default GoogleRatingBadge; 