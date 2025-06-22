import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cart.service';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await cartService.getCart();
            setCart(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (productType, productId, quantity, withOldBattery = false) => {
        try {
            const updatedCart = await cartService.addToCart({ productType, productId, quantity, withOldBattery });
            setCart(updatedCart);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const updateCartItem = async (productType, productId, quantity) => {
        try {
            const updatedCart = await cartService.updateCartItem(productType, productId, quantity);
            setCart(updatedCart);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const removeFromCart = async (productType, productId) => {
        try {
            const updatedCart = await cartService.removeFromCart(productType, productId);
            setCart(updatedCart);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const value = {
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        refreshCart: fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 