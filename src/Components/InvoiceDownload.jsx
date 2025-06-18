import React, { useState } from 'react';
import { FiDownload, FiEye, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import API from '../utils/api';

const InvoiceDownload = ({ orderId, orderNumber, className = '' }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/invoices/${orderId}/download`, {
                responseType: 'blob'
            });

            if (response.status === 200) {
                // Create blob from response
                const blob = response.data;

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `invoice-${orderNumber}.html`;

                // Trigger download
                document.body.appendChild(link);
                link.click();

                // Cleanup
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.success('Invoice downloaded successfully!');
            } else {
                toast.error('Failed to download invoice');
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Failed to download invoice');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/invoices/${orderId}/download`);

            if (response.status === 200) {
                const html = response.data;

                // Open in new window
                const newWindow = window.open('', '_blank');
                newWindow.document.write(html);
                newWindow.document.close();
            } else {
                toast.error('Failed to preview invoice');
            }
        } catch (error) {
            console.error('Error previewing invoice:', error);
            toast.error('Failed to preview invoice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            <button
                onClick={handleDownload}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-[#008246] text-white rounded-lg hover:bg-[#005a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                <FiDownload className="w-4 h-4" />
                {loading ? 'Downloading...' : 'Download'}
            </button>

            <button
                onClick={handlePreview}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 border border-[#008246] text-[#008246] rounded-lg hover:bg-[#008246] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                <FiEye className="w-4 h-4" />
                Preview
            </button>
        </div>
    );
};

export default InvoiceDownload; 