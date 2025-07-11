import { getData, postData, putData, deleteData } from '../utils/http';

export const cartService = {
    // Get cart
    getCart: async () => {
        return await getData('/cart');
    },

    // Add item to cart
    addToCart: async (cartData) => {
        return await postData('/cart/add', cartData);
    },

    // Update cart item quantity
    updateCartItem: async (productType, productId, quantity) => {
        return await putData(`/cart/${productType}/${productId}`, {
            quantity
        });
    },

    // Remove item from cart
    removeFromCart: async (productType, productId) => {
        return await deleteData(`/cart/${productType}/${productId}`);
    }
}; 