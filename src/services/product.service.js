import axios from 'axios';
import { backend_url } from '../config/api_route';

const API_URL = backend_url

export const productService = {
    // Get all products with filters
    getAllProducts: async (filters = {}) => {
        const response = await axios.get(`${API_URL}/products`, { params: filters });
        return response.data;
    },

    // Get single product
    getProduct: async (type, id) => {
        console.log('Product service - Fetching product:', { type, id });
        // Map URL types to backend types
        const typeMap = {
            'solar-pcu': 'solar-pcu',
            'solar-pv': 'solar-pv',
            'solar-street-light': 'solar-street-light',
            'ups': 'ups',
            'inverter': 'inverter',
            'battery': 'battery'
        };

        const backendType = typeMap[type] || type;
        console.log('Product service - Using backend type:', backendType);

        const response = await axios.get(`${API_URL}/products/${backendType}/${id}`);
        console.log('Product service - Received response:', response.data);
        return response.data;
    },

    // Get filter options
    getFilterOptions: async () => {
        const response = await axios.get(`${API_URL}/products/filters`);
        return response.data;
    }
};


