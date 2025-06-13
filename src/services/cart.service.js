import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const cartService = {
    // Get cart
    getCart: async () => {
        const response = await axios.get(`${API_URL}/cart`);
        return response.data;
    },

    // Add item to cart
    addToCart: async (productType, productId, quantity) => {
        const response = await axios.post(`${API_URL}/cart/add`, {
            productType,
            productId,
            quantity
        });
        return response.data;
    },

    // Update cart item quantity
    updateCartItem: async (productType, productId, quantity) => {
        const response = await axios.put(`${API_URL}/cart/${productType}/${productId}`, {
            quantity
        });
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (productType, productId) => {
        const response = await axios.delete(`${API_URL}/cart/${productType}/${productId}`);
        return response.data;
    }
}; 