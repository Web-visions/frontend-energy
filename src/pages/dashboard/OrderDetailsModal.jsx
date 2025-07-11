import React from 'react';
import { FaTimes, FaDownload, FaUser, FaMapMarkerAlt, FaCreditCard, FaBox } from 'react-icons/fa';
import { getData } from '../../utils/http';
import { img_url } from '../../config/api_route';
import noImageFound from '../../assets/no_img_found.png';
import { toast } from 'react-hot-toast';

// --- A to Z helpers (put at top of file) ---
const getItemUnitPrice = (item) => {
    if (typeof item.price === 'number') return item.price;
    // Try to infer price from product if needed
    if (item.product?.priceWithOldBattery && item.product?.priceWithoutOldBattery) {
        // If both present, default to "with old battery" for showing price unless logic is present
        return item.product.priceWithOldBattery;
    }
    return item.product?.mrp || 0;
};

const getItemTotalPrice = (item) => {
    if (typeof item.totalPrice === "number") return item.totalPrice;
    const unit = getItemUnitPrice(item);
    return unit * (item.quantity || 1);
};

const getSubtotal = (ord) => {
    if (typeof ord.pricing?.subtotal === "number") return ord.pricing.subtotal;
    return (ord.items || []).reduce((sum, item) => sum + getItemTotalPrice(item), 0);
};

const getDeliveryCharge = (ord) => {
    if (typeof ord?.deliveryCharge === "number") return ord.deliveryCharge;
    return 0;
};

const getTax = (ord) => {
    if (typeof ord.pricing?.tax === "number") return ord.pricing.tax;
    return 0;
};

const getTotal = (ord) => {
    if (typeof ord.totalAmount === "number") return ord.totalAmount;
    if (typeof ord.pricing?.total === "number") return ord.pricing.total;
    const subtotal = getSubtotal(ord);
    const delivery = getDeliveryCharge(ord);
    const tax = getTax(ord);
    return subtotal + delivery + tax;
};

const getStatus = (ord) => ord.orderStatus ?? ord.status;
const getShippingInfo = (ord) => ord.shippingInfo ?? ord.shippingDetails;
const getPaymentInfo = (ord) => ord.paymentInfo ?? ord.paymentDetails;
const getItemProduct = (item) => item.product ?? item.productId;

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const getStatusColor = (status) => {
    const colors = {
        Pending: 'bg-yellow-100 text-yellow-800', Confirmed: 'bg-blue-100 text-blue-800',
        Processing: 'bg-purple-100 text-purple-800', Shipped: 'bg-indigo-100 text-indigo-800',
        Delivered: 'bg-green-100 text-green-800', Cancelled: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800', shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

// --- COMPONENT ---
const OrderDetailsModal = ({ order, onClose }) => {
    const shipping = getShippingInfo(order);
    const payment = getPaymentInfo(order);

    // Calculate totals with and without old battery exchange
    const hasExchangeOptions = order.items.some(item => {
        const product = getItemProduct(item);
        return product?.priceWithOldBattery && product?.priceWithoutOldBattery;
    });
    let totalWithExchange = 0;
    let totalWithoutExchange = 0;
    if (hasExchangeOptions) {
        order.items.forEach(item => {
            const product = getItemProduct(item);
            if (product?.priceWithOldBattery && product?.priceWithoutOldBattery) {
                totalWithExchange += product.priceWithOldBattery * item.quantity;
                totalWithoutExchange += product.priceWithoutOldBattery * item.quantity;
            } else {
                // Fallback to item price
                totalWithExchange += getItemUnitPrice(item) * item.quantity;
                totalWithoutExchange += getItemUnitPrice(item) * item.quantity;
            }
        });
        totalWithExchange += getDeliveryCharge(order) + getTax(order);
        totalWithoutExchange += getDeliveryCharge(order) + getTax(order);
    }

    // Calculate actual battery discount if withOldBattery is true
    let batteryExchangeDiscount = 0;
    order.items.forEach(item => {
        if (item.productType === 'battery' && item.withOldBattery && item.product?.priceWithoutOldBattery && item.product?.priceWithOldBattery) {
            batteryExchangeDiscount += (item.product.priceWithoutOldBattery - item.product.priceWithOldBattery) * item.quantity;
        }
    });

    const handleDownloadInvoice = async () => {
        toast.error("Invoice download is not yet implemented.");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                        <p className="text-gray-600">Order #{order.orderNumber}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleDownloadInvoice}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <FaDownload className="mr-2" /> Download Invoice
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Order Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2"><FaBox className="text-blue-600 mr-2" /><h3 className="font-semibold text-gray-800">Order Info</h3></div>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Order Number:</span> {order.orderNumber}</p>
                                <p><span className="font-medium">Date:</span> {formatDate(order.createdAt)}</p>
                                <p><span className="font-medium">Status:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatus(order))}`}>
                                        {getStatus(order)}
                                    </span>
                                </p>
                                <p><span className="font-medium">Items:</span> {order.items.length}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2"><FaUser className="text-green-600 mr-2" /><h3 className="font-semibold text-gray-800">Customer Info</h3></div>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Name:</span> {shipping?.fullName}</p>
                                <p><span className="font-medium">Email:</span> {shipping?.email}</p>
                                <p><span className="font-medium">Phone:</span> {shipping?.phone}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2"><FaCreditCard className="text-purple-600 mr-2" /><h3 className="font-semibold text-gray-800">Payment Info</h3></div>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Method:</span> {payment?.method?.toUpperCase()}</p>
                                <p><span className="font-medium">Status:</span> {order.paymentStatus ?? payment?.status}</p>
                                {(payment?.razorpay_payment_id || payment?.transactionId) && (
                                    <p className="truncate"><span className="font-medium">Transaction ID:</span> {payment?.razorpay_payment_id || payment?.transactionId}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4"><FaMapMarkerAlt className="text-red-600 mr-2" /><h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3></div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium">{shipping?.fullName}</p>
                            <p>{shipping?.address}</p>
                            {shipping?.landmark && <p>Landmark: {shipping.landmark}</p>}
                            <p>{shipping?.city}, {shipping?.state}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item, index) => {
                                        const product = getItemProduct(item);
                                        const imageSrc = product?.image ? `${img_url}${product.image}` : noImageFound;

                                        // Battery price logic
                                        let displayUnitPrice = item.productType === 'battery'
                                            ? (item?.withOldBattery ? product?.priceWithOldBattery : product?.priceWithoutOldBattery)
                                            : getItemUnitPrice(item);
                                        let displayMRP = product?.mrp;
                                        let showDiscount = item.productType === 'battery' && item.withOldBattery && product.priceWithoutOldBattery && product.priceWithOldBattery;
                                        let discountAmount = showDiscount ? (product.priceWithoutOldBattery - product.priceWithOldBattery) : 0;
                                        let discountPercent = showDiscount && product.priceWithoutOldBattery ? Math.round(100 * discountAmount / product.priceWithoutOldBattery) : 0;

                                        return (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img className="h-10 w-10 rounded-lg object-cover mr-3" src={imageSrc} alt={product?.name || 'Product Image'} />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{product?.name || 'Product Name Not Available'}</div>
                                                            <div className="text-sm text-gray-500">{item.productType}</div>
                                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                {displayMRP && (
                                                                    <span className="text-xs text-gray-400 line-through">{formatCurrency(displayMRP)}</span>
                                                                )}
                                                                <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                                                    {formatCurrency(displayUnitPrice)}
                                                                </span>
                                                                {showDiscount && (
                                                                    <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded">
                                                                        -{discountPercent}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {/* Show exchange badge for battery items */}
                                                            {item.productType === 'battery' && (
                                                                <span className={`inline-block mt-1 ml-0.5 px-2 py-1 rounded-full text-xs font-semibold ${item.withOldBattery === true ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                    {item.withOldBattery === true ? 'With Old Battery Exchange' : 'Without Old Battery Exchange'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(displayUnitPrice)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(displayUnitPrice * item.quantity)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                        <div className="space-y-2">
                            {/* Subtotal: sum of actual charged prices (battery logic included) */}
                            <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{
                                formatCurrency(
                                    (order.items || []).reduce((sum, item) => {
                                        const product = getItemProduct(item);
                                        let price = item.productType === 'battery'
                                            ? (item.withOldBattery ? product?.priceWithOldBattery : product?.priceWithoutOldBattery)
                                            : getItemUnitPrice(item);
                                        return sum + price * (item.quantity || 1);
                                    }, 0)
                                )
                            }</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Delivery Charges:</span><span className="font-medium">{formatCurrency(getDeliveryCharge(order))}</span></div>
                            {/* No separate discount row, since price already reflects exchange */}
                            <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2"><span>Total Amount:</span><span>{formatCurrency(getTotal(order))}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
