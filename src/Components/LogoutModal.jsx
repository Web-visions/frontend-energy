import React from 'react';
import { X } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Confirm Logout
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to logout from your account?
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-gradient-to-r from-brand-purple via-brand-purple-light to-brand-purple-dark hover:from-brand-purple-dark hover:via-brand-purple hover:to-brand-purple-light rounded-lg transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal; 