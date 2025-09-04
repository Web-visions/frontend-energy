import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { img_url } from '../config/api_route';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiTag } from 'react-icons/fi';
import noImageFound from '../assets/no_img_found.png';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
    const { cart, loading, error, updateCartItem, removeFromCart, refreshCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [updatingItems, setUpdatingItems] = useState(new Set());
    const [removingItems, setRemovingItems] = useState(new Set());

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }
    }, []);

    const handleQuantityChange = async (productType, productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems(prev => new Set(prev).add(`${productType}-${productId}`));
        try {
            await updateCartItem(productType, productId, newQuantity);
            toast.success('Cart updated successfully');
        } catch (err) {
            toast.error('Failed to update cart');
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(`${productType}-${productId}`);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (productType, productId) => {
        setRemovingItems(prev => new Set(prev).add(`${productType}-${productId}`));
        try {
            await removeFromCart(productType, productId);
            toast.success('Item removed from cart');
        } catch (err) {
            toast.error('Failed to remove item');
        } finally {
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(`${productType}-${productId}`);
                return newSet;
            });
        }
    };


 const cartCalculations = useMemo(() => {
  if (!cart?.items) return { totalMRP: 0, subtotal: 0, discountOnMRP: 0, exchangeDiscount: 0 };

  let totalMRP = 0;
  let subtotal = 0;
  let finalTotal = 0;

  for (const cartItem of cart.items) {
    const product = cartItem.productId;
    if (!product) continue;

    const isBattery = cartItem.productType === 'battery';
    const isSolar = cartItem.productType?.startsWith('solar-');

    if (isBattery) {
      const withoutExchange = Number(product.priceWithoutOldBattery) || 0;
      const withExchange = Number(product.priceWithOldBattery) || withoutExchange;
      const mrp = Number(product.mrp) || withoutExchange;

      totalMRP += mrp * cartItem.quantity;
      subtotal += withoutExchange * cartItem.quantity;
      finalTotal += (cartItem.withOldBattery ? withExchange : withoutExchange) * cartItem.quantity;
      continue;
    }

    if (isSolar) {
      const price = Number(product.price) || 0;
      totalMRP += price * cartItem.quantity;     // no MRP concept → treat price as MRP
      subtotal += price * cartItem.quantity;
      finalTotal += price * cartItem.quantity;
      continue;
    }

    // Inverter / UPS / others
    const selling = Number(product.sellingPrice);
    const mrp = Number(product.mrp);
    const base = Number(product.price);

    const unit = [selling, mrp, base].find(Number.isFinite) || 0;
    const unitMrp = Number.isFinite(mrp) ? mrp : unit;

    totalMRP += unitMrp * cartItem.quantity;
    subtotal += unit * cartItem.quantity;
    finalTotal += unit * cartItem.quantity;
  }

  const discountOnMRP = Math.max(0, totalMRP - subtotal);
  const exchangeDiscount = Math.max(0, subtotal - finalTotal);

  return { totalMRP, subtotal, discountOnMRP, exchangeDiscount };
}, [cart]);


    const getItemDisplayPrice = (cartItem) => {
  const product = cartItem.productId;
  if (!product) return { current: 0, original: null };

  if (cartItem.productType === 'battery') {
    const baseWithout = Number(product.priceWithoutOldBattery) || 0;
    const baseWith = Number(product.priceWithOldBattery) || baseWithout;
    const current = cartItem.withOldBattery ? baseWith : baseWithout;
    const original = current < baseWithout ? baseWithout : (product.mrp && product.mrp > current ? product.mrp : null);
    return { current, original };
  }

  if (cartItem.productType.startsWith('solar-')) {
    const current = Number(product.price) || 0;
    return { current, original: null };
  }

  const selling = Number(product.sellingPrice);
  const mrp = Number(product.mrp);
  const base = Number(product.price);
  const current = [selling, mrp, base].find(Number.isFinite) || 0;
  const original = Number.isFinite(mrp) && mrp > current ? mrp : null;

  return { current, original };
};

    const getProductImage = (product) => {
        if (product?.images && product?.images?.length > 0) {
            return img_url + product?.images[0];
        }
        return img_url + product?.image;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen  bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">Error: {error}</div>
                    <button
                        onClick={refreshCart}
                        className="bg-[#008246] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#005a2f] transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-[#008246] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#005a2f] transition-colors duration-200 shadow-lg"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <span className="bg-[#008246] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => {
                            const isUpdating = updatingItems?.has(`${item.productType}-${item.productId?._id}`);
                            const isRemoving = removingItems.has(`${item.productType}-${item.productId?._id}`);
                            const itemPrice = getItemDisplayPrice(item);
                            const totalItemPrice = itemPrice.current * item?.quantity;

                            return (
                                <div
                                    key={`${item.productType}-${item.productId?._id}`}
                                    className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 ${isRemoving ? 'opacity-50' : ''
                                        }`}
                                >
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 flex-shrink-0">
                                            <img
                                                src={getProductImage(item?.productId)}
                                                alt={item?.productId?.name}
                                                className="w-full h-full object-cover rounded-xl"
                                                onError={(e) => {
                                                    e.target.src = noImageFound;
                                                }}
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {item?.productId?.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        {item.productType.replace('-', ' ')}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Brand: {item?.productId?.brand?.name || 'N/A'}
                                                    </p>
                                                    {item.withOldBattery && (
                                                        <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md">
                                                            <FiTag className="h-3 w-3" />
                                                            <span className="text-xs font-medium">Old Battery Exchange</span>
                                                        </div>
                                                    )}
                                                    {/* Product Specifications */}
                                                    <div className="mt-2 space-y-1">
                                                        {item?.productId?.modelName && (
                                                            <p className="text-xs text-gray-500">
                                                                Model: {item?.productId?.modelName}
                                                            </p>
                                                        )}
                                                        {item?.productId?.capacity && (
                                                            <p className="text-xs text-gray-500">
                                                                Capacity: {item.productId.capacity}VA
                                                            </p>
                                                        )}
                                                        {item.productId?.AH && (
                                                            <p className="text-xs text-gray-500">
                                                                Capacity: {item.productId.AH}Ah
                                                            </p>
                                                        )}
                                                        {item.productId?.wattage && (
                                                            <p className="text-xs text-gray-500">
                                                                Wattage: {item.productId.wattage}W
                                                            </p>
                                                        )}
                                                        {item.productId?.power && (
                                                            <p className="text-xs text-gray-500">
                                                                Power: {item.productId.power}W
                                                            </p>
                                                        )}
                                                        {item.productId?.batteryType && (
                                                            <p className="text-xs text-gray-500">
                                                                Type: {item.productId.batteryType}
                                                            </p>
                                                        )}
                                                        {item.productId?.warranty && (
                                                            <p className="text-xs text-gray-500">
                                                                Warranty: {item.productId.warranty}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.productType, item?.productId?._id)}
                                                    disabled={isRemoving}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productType, item.productId._id, item.quantity - 1)}
                                                        disabled={isUpdating || item.quantity <= 1}
                                                        className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FiMinus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-4 py-2 border-x border-gray-200 min-w-[60px] text-center">
                                                        {isUpdating ? '...' : item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productType, item.productId._id, item.quantity + 1)}
                                                        disabled={isUpdating}
                                                        className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FiPlus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        ₹{(itemPrice.current * item.quantity).toLocaleString()}
                                                    </p>
                                                    <div className="flex items-center justify-end gap-2">
                                                        {itemPrice.original && (
                                                            <p className="text-sm text-gray-400 line-through">
                                                                ₹{itemPrice.original.toLocaleString()}
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-500">
                                                            ₹{itemPrice.current.toLocaleString()} each
                                                        </p>
                                                    </div>
                                                    {itemPrice.original && (
                                                        <p className="text-xs text-green-600 font-medium">
                                                            Save ₹{(itemPrice.original - itemPrice.current).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Total MRP</span>
                                    <span>₹{cartCalculations.totalMRP.toLocaleString()}</span>
                                </div>
                                {cartCalculations.discountOnMRP > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount on MRP</span>
                                        <span>- ₹{cartCalculations.discountOnMRP.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600 font-semibold">
                                    <span>Subtotal</span>
                                    <span>₹{cartCalculations.subtotal.toLocaleString()}</span>
                                </div>
                                {cartCalculations.exchangeDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Old Battery Exchange</span>
                                        <span>- ₹{cartCalculations.exchangeDiscount.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{cart.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Including all taxes</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-[#008246] text-white font-semibold py-4 rounded-xl text-lg hover:bg-[#005a2f] transition-colors duration-200 shadow-lg mb-4"
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={() => navigate('/products')}
                                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 