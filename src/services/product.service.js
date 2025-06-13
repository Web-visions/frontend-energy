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
        const response = await axios.get(`${API_URL}/products/${type}/${id}`);
        return response.data;
    },

    // Get filter options
    getFilterOptions: async () => {
        const response = await axios.get(`${API_URL}/products/filters`);
        return response.data;
    }
}; 