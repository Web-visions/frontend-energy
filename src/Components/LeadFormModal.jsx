import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiPhone, FiMail, FiZap, FiClock, FiHome, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import API from '../utils/api';

const LeadFormModal = ({ isOpen, onClose, projectType }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Reset form data and set the new project type when the modal is opened
        if (isOpen) {
            setFormData({
                name: '',
                contact: '',
                email: '',
                loadInKW: '',
                backupTime: '',
                rooftopSpace: '',
                sanctionLoad: '',
                investmentAmount: '',
                projectType: projectType
            });
        }
    }, [isOpen, projectType]);

    const projectTypes = {
        'off-grid-lead': {
            title: 'Off Grid Solar Project',
            description: 'Get a customized off-grid solar solution for your needs',
            fields: ['name', 'contact', 'email', 'loadInKW', 'backupTime', 'rooftopSpace', 'investmentAmount']
        },
        'on-grid-lead': {
            title: 'On Grid Solar Project',
            description: 'Connect to the grid and earn from your solar installation',
            fields: ['name', 'contact', 'email', 'sanctionLoad', 'rooftopSpace', 'investmentAmount']
        },
        'hybrid-lead': {
            title: 'Hybrid Solar Project',
            description: 'Best of both worlds - grid connection with battery backup',
            fields: ['name', 'contact', 'email', 'backupTime', 'sanctionLoad', 'rooftopSpace', 'investmentAmount']
        }
    };

    const currentProject = projectTypes[projectType];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!currentProject) return false;
        const requiredFields = ['name', 'contact'];

        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                return false;
            }
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.contact)) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }

        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Please enter a valid email address');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await API.post('/leads', formData);

            if (response.status === 201) {
                toast.success('Lead submitted successfully! We will contact you soon.');
                onClose();
            } else {
                toast.error('Failed to submit lead');
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
            toast.error(error.response?.data?.message || 'Failed to submit lead');
        } finally {
            setLoading(false);
        }
    };

    const renderField = (fieldName) => {
        const fieldConfig = {
            name: { label: 'Full Name *', type: 'text', placeholder: 'Enter your full name', icon: FiUser },
            contact: { label: 'Contact Number *', type: 'tel', placeholder: 'Enter your 10-digit phone number', icon: FiPhone },
            email: { label: 'Email Address (Optional)', type: 'email', placeholder: 'Enter your email address', icon: FiMail },
            loadInKW: { label: 'Load in KW *', type: 'number', placeholder: 'Enter your load requirement in KW', icon: FiZap },
            backupTime: { label: 'Backup Time *', type: 'text', placeholder: 'e.g., 4 hours, 8 hours', icon: FiClock },
            rooftopSpace: { label: 'Rooftop Space *', type: 'text', placeholder: 'e.g., 1000 sq ft, 500 sq ft', icon: FiHome },
            sanctionLoad: { label: 'Sanction Load by Govt. *', type: 'text', placeholder: 'Enter sanctioned load', icon: FiZap },
            investmentAmount: { label: 'Investment Amount (Optional)', type: 'text', placeholder: 'e.g., 2-3 lakhs, 5-7 lakhs', icon: FiDollarSign }
        };

        const config = fieldConfig[fieldName];
        const IconComponent = config.icon;

        return (
            <div key={fieldName} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{config.label}</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconComponent className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={config.type}
                        name={fieldName}
                        value={formData[fieldName] || ''}
                        onChange={handleInputChange}
                        placeholder={config.placeholder}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent transition-colors"
                    />
                </div>
            </div>
        );
    };

    if (!isOpen || !currentProject) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{currentProject.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">{currentProject.description}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FiX className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {currentProject.fields.map(field => renderField(field))}
                    <button type="submit" disabled={loading} className="w-full bg-[#008246] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#005a2f] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Submitting...' : 'Submit Lead'}
                    </button>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        * Required fields. We will contact you within 24 hours.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LeadFormModal; 