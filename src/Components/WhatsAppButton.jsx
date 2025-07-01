import { WhatsApp } from "@mui/icons-material";
import React from "react";

const WhatsAppButton = () => (
    <a
        href="https://wa.me/918929490346"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-200 group"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)' }}
    >
        <WhatsApp sx={{ fontSize: 32 }} />
    </a>
);

export default WhatsAppButton; 