import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { img_url } from '../config/api_route';
import { productService } from '../services/product.service';
import { reviewService } from '../services/review.service';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { toast } from 'react-hot-toast';
import noImageFound from '../assets/no_img_found.png';
import FAQ from '../pages/FAQ';
import { useAuth } from '../context/AuthContext';
import {
    Star,
    StarHalf,
    ShoppingCart,
    Share2,
    Shield,
    Truck,
    RotateCcw,
    Award,
    CheckCircle,
    Minus,
    Plus,
    User,
    MessageCircle,
    Info,
    Zap,
    Battery,
    Settings,
    X,
    Copy,
    Facebook,
    Twitter,
    Linkedin,
    MessageSquare,
    Eye,
    TrendingUp
} from 'lucide-react';

const RegularProductDetail = () => {
    const { type, id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [hasOldBattery, setHasOldBattery] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [userReview, setUserReview] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [showShareModal, setShowShareModal] = useState(false);

    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { currentUser } = useAuth();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = await productService.getProduct(type, id);
                setProduct(productData);
            } catch (err) {
                setError(err.message);
                toast.error('Error loading product details');
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [type, id]);

    useEffect(() => {
        fetchReviews();
    }, [id]);

    const fetchReviews = async (page = 1) => {
        try {
            const reviewsData = await reviewService.getProductReviews(id, page);
            setReviews(prev => page === 1 ? reviewsData.reviews : [...prev, ...reviewsData.reviews]);
            setPagination(reviewsData.pagination);
        } catch (err) {
            toast.error('Error loading reviews');
        }
    };

  const handleAddToCart = async () => {
  try {
    const success = await addToCart(type, product._id, quantity, hasOldBattery);
    if (success) {
      toast.success('Product added to cart successfully!', { duration: 10000 });
      setTimeout(() => {
        window.location.reload();
      }, 500); 
    } else {
      toast.error('Failed to add product to cart');
    }
  } catch (error) {
    toast.error('Error adding product to cart');
  }
};

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={`full_${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <StarHalf key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            );
        }

        for (let i = stars.length; i < 5; i++) {
            stars.push(
                <Star key={`empty_${i}`} className="w-5 h-5 text-gray-300" />
            );
        }

        return stars;
    };

    // Enhanced features renderer to handle both string and array formats
    const renderFeatures = (features) => {
        if (!features) return [];

        // If features is a string with bullet points
        if (typeof features === 'string') {
            // Split by bullet points or newlines and clean up
            const featureList = features
                .split(/[•\n]/)
                .map(item => item.trim())
                .filter(item => item && item.length > 0);

            return featureList;
        }

        // If features is already an array
        if (Array.isArray(features)) {
            return features;
        }

        return [];
    };

    // Share functionality
    const handleShare = () => {
        setShowShareModal(true);
    };

    const shareToSocial = (platform) => {
        const url = window.location.href;
        const title = `Check out this ${product.name}`;

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
        setShowShareModal(false);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
            setShowShareModal(false);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const handleReviewSubmitted = async () => {
        try {
            await fetchReviews();
            setShowReviewForm(false);
        } catch (err) {
            toast.error('Error refreshing reviews');
        }
    };

    const handleEditReview = (review) => {
        setUserReview(review);
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await reviewService.deleteReview(reviewId);
            await fetchReviews();
            toast.success('Review deleted successfully');
        } catch (err) {
            toast.error('Error deleting review');
        }
    };

    const getProductPrice = () => {
        if (product?.category?.name?.toLowerCase() === 'solar' ||
            product?.type?.toLowerCase()?.includes('pcu') ||
            product?.type?.toLowerCase()?.includes('solar')) {
            return product?.price;
        }

        if (product?.category?.name?.toLowerCase() === 'battery') {
            return hasOldBattery ? product.priceWithOldBattery : product.priceWithoutOldBattery;
        }

        if (product?.category?.name?.toLowerCase() === 'inverter') {
            return product?.sellingPrice || product?.mrp;
        }
        return product?.sellingPrice || product?.mrp;
    };

    const renderSpecifications = () => {
        if (!product) return [];

        const specs = [];
        const categoryName = product.category?.name?.toLowerCase();
        const productType = product.type?.toLowerCase();

        if (categoryName === 'solar' || productType?.includes('pcu') || productType?.includes('solar')) {
            if (productType?.includes('pcu')) {
                specs.push(
                    { label: 'Type', value: product.type, icon: Settings },
                    { label: 'Wattage', value: product.wattage ? `${product.wattage}W` : 'N/A', icon: Zap },
                    { label: 'Model Name', value: product.modelName || 'N/A', icon: Info },
                    { label: 'Warranty', value: product.warranty || 'N/A', icon: Shield },
                    { label: 'Dimensions', value: product.dimension || 'N/A', icon: Info },
                    { label: 'Weight', value: product.weight ? `${product.weight}kg` : 'N/A', icon: Info }
                );
            } else if (productType?.includes('polycrystalline') || productType?.includes('monocrystalline')) {
                specs.push(
                    { label: 'Type', value: product.type || 'N/A', icon: Settings },
                    { label: 'Model Name', value: product.modelName || 'N/A', icon: Info },
                    { label: 'SKU', value: product.sku || 'N/A', icon: Info },
                    { label: 'Weight', value: product.weight ? `${product.weight}kg` : 'N/A', icon: Info },
                    { label: 'Dimensions', value: product.dimension || 'N/A', icon: Info },
                    { label: 'Warranty', value: product.warranty || 'N/A', icon: Shield }
                );
            } else {
                specs.push(
                    { label: 'Model Name', value: product.modelName || 'N/A', icon: Info },
                    { label: 'Power', value: product.power ? `${product.power}W` : 'N/A', icon: Zap },
                    { label: 'Warranty', value: product.warranty || 'N/A', icon: Shield }
                );
            }
            return specs;
        }

        switch (categoryName) {
            case 'inverter':
                specs.push(
                    { label: 'Capacity', value: `${product.capacity}VA`, icon: Battery },
                    { label: 'Dimensions', value: product.dimension, icon: Info },
                    { label: 'Warranty', value: product.warranty, icon: Shield }
                );
                break;
            case 'ups':
                specs.push(
                    { label: 'Type', value: product.type, icon: Settings },
                    { label: 'Output Power', value: `${product.outputPowerWattage}W`, icon: Zap },
                    { label: 'Input Voltage', value: `${product.inputVoltage}V`, icon: Zap },
                    { label: 'Output Voltage', value: `${product.outputVoltage}V`, icon: Zap },
                    { label: 'Dimensions', value: product.dimension, icon: Info },
                    { label: 'Warranty', value: product.warranty, icon: Shield }
                );
                break;
            case 'battery':
                specs.push(
                    { label: 'Battery Type', value: product.batteryType, icon: Battery },
                    { label: 'Capacity', value: `${product.AH}Ah`, icon: Battery },
                    { label: 'Weight', value: product.nominalFilledWeight, icon: Info },
                    { label: 'Dimensions', value: product.dimension, icon: Info },
                    { label: 'Warranty', value: product.warranty, icon: Shield }
                );
                break;
        }

        return specs;
    };

    const averageRating = calculateAverageRating(product?.reviews);
    const currentPrice = getProductPrice();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-lg text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Share Product</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Social Media Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => shareToSocial('facebook')}
                                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"
                                >
                                    <Facebook className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-blue-600">Facebook</span>
                                </button>

                                <button
                                    onClick={() => shareToSocial('twitter')}
                                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"
                                >
                                    <Twitter className="w-5 h-5 text-blue-500" />
                                    <span className="font-medium text-blue-500">Twitter</span>
                                </button>

                                <button
                                    onClick={() => shareToSocial('linkedin')}
                                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"
                                >
                                    <Linkedin className="w-5 h-5 text-blue-700" />
                                    <span className="font-medium text-blue-700">LinkedIn</span>
                                </button>

                                <button
                                    onClick={() => shareToSocial('whatsapp')}
                                    className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200"
                                >
                                    <MessageSquare className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-green-600">WhatsApp</span>
                                </button>
                            </div>

                            {/* Copy Link Button */}
                            <button
                                onClick={copyToClipboard}
                                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 border-2 border-dashed border-gray-300"
                            >
                                <Copy className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-700">Copy Link</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <nav className="flex space-x-2 text-sm text-gray-600">
                        <span className="hover:text-green-600 cursor-pointer">Home</span>
                        <span>/</span>
                        <span className="hover:text-green-600 cursor-pointer capitalize">{product.category?.name}</span>
                        <span>/</span>
                        <span className="text-gray-900 font-medium truncate">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {/* Enhanced Image Gallery */}
                    <div className="space-y-6">
                        <div className="relative group">
                            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                                <img
                                    src={img_url + (product.images?.[selectedImage] || product.image)}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = noImageFound;
                                    }}
                                />
                            </div>

                            {/* Updated Image Controls */}
                            <div className="absolute top-6 right-6 flex gap-2">

                                <button
                                    onClick={handleShare}
                                    className="p-3 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 hover:bg-white transition-all duration-300"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Thumbnails */}
                        {(product.images && product.images.length > 1) && (
                            <div className="grid grid-cols-5 gap-3">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-3 transition-all duration-300 ${selectedImage === index
                                                ? 'border-green-500 shadow-lg ring-4 ring-green-100 scale-105'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                            }`}
                                    >
                                        <img
                                            src={img_url + image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-contain p-3"
                                            onError={(e) => {
                                                e.target.src = noImageFound;
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Enhanced Product Info */}
                    <div className="space-y-8">
                        {/* Brand Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl p-3 flex items-center justify-center">
                                    <img
                                        src={img_url + product.brand?.logo}
                                        alt={product.brand?.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.src = noImageFound;
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg">{product.brand?.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Award className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-600 font-medium">Authorized Dealer</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Title & Category */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    {product.category?.name}
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Popular</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        {/* Enhanced Rating */}
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="flex">{renderStars(averageRating)}</div>
                                <span className="text-xl font-bold text-gray-900">{averageRating}</span>
                            </div>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4" />
                                <span>{product.reviews?.length || 0} reviews</span>
                            </div>
                        </div>

                        {/* Enhanced Pricing Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                            <div className="space-y-6">
                                {/* Quick Info */}
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-gray-200 pb-4">
                                    {product.warranty && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Warranty</p>
                                            <p className="text-lg font-semibold text-gray-800">{product.warranty}</p>
                                        </div>
                                    )}
                                    {product.AH && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Capacity</p>
                                            <p className="text-lg font-semibold text-gray-800">{product.AH} AH</p>
                                        </div>
                                    )}
                                </div>


                                <div className="border-t border-gray-200 pt-6">
                                    <div className="flex items-baseline gap-4 mb-4">
                                        <span className="text-4xl font-bold text-green-600">
                                            ₹{currentPrice?.toLocaleString() || 'Contact for Price'}
                                        </span>
                                        {product.category?.name?.toLowerCase() === 'inverter' && product.mrp > product.sellingPrice && (
                                            <>
                                                <span className="text-xl text-gray-400 line-through">
                                                    ₹{product.mrp.toLocaleString()}
                                                </span>
                                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                    {Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}% OFF
                                                </span>
                                            </>
                                        )}
                                        {product.mrp > currentPrice && product.category?.name?.toLowerCase() !== 'inverter' && (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                {Math.round(((product.mrp - currentPrice) / product.mrp) * 100)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Price Breakdown */}
                                    {product.category?.name?.toLowerCase() === 'battery' && (
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">MRP:</span>
                                                <span className="line-through text-gray-400">₹{product.mrp?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Without Exchange:</span>
                                                <span className="font-semibold">₹{product.priceWithoutOldBattery?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-t pt-2">
                                                <span className="font-semibold text-green-600">With Old Battery:</span>
                                                <span className="font-bold text-green-600">₹{product.priceWithOldBattery?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-6 mt-6">
                                        <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-3 hover:bg-gray-50 transition-colors duration-200 text-gray-600"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-6 py-3 border-x-2 border-gray-200 font-semibold text-gray-900 min-w-[60px] text-center">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="p-3 hover:bg-gray-50 transition-colors duration-200 text-gray-600"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Old Battery Checkbox */}
                                    {product.category?.name?.toLowerCase() === 'battery' && (
                                        <div className="mt-6">
                                            <label className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl cursor-pointer hover:bg-green-100 transition-colors duration-200">
                                                <input
                                                    type="checkbox"
                                                    checked={hasOldBattery}
                                                    onChange={(e) => setHasOldBattery(e.target.checked)}
                                                    className="w-5 h-5 text-green-600 rounded border-green-300 focus:ring-green-500"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <RotateCcw className="w-5 h-5 text-green-600" />
                                                    <span className="font-medium text-green-700">I have an old battery to exchange</span>
                                                </div>
                                            </label>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 mt-8">
                                        {!currentUser ? (
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="flex-1 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                            >
                                                <User className="w-5 h-5" />
                                                Login to Buy
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleAddToCart}
                                                className="flex-1 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                {/* FIXED: Better layout for Features, Description and Tags */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Description */}
                    <div className="space-y-8">
                        {/* Description */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Info className="w-6 h-6 text-blue-600" />
                                Product Description
                            </h3>
                            <div className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-xl">
                                {product.description}
                            </div>
                        </div>

                        {/* Tags */}
                        {product.staticTags && product.staticTags.length > 0 && (
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Tags</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.staticTags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-gradient-to-r from-green-50 to-blue-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Features and Specifications */}
                    <div className="space-y-8">
                        {/* Enhanced Features - NOW SUPPORTS BOTH STRING AND ARRAY */}
                        {product.features && (
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    Key Features
                                </h3>
                                <div className="grid gap-4">
                                    {renderFeatures(product.features).map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="text-gray-700 leading-relaxed font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Specifications */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Settings className="w-6 h-6 text-purple-600" />
                                Technical Specifications
                            </h3>
                            <div className="grid gap-4">
                                {renderSpecifications().map((spec, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                        <div className="flex items-center gap-3">
                                            {spec.icon && <spec.icon className="w-5 h-5 text-gray-600" />}
                                            <span className="font-semibold text-gray-700">{spec.label}</span>
                                        </div>
                                        <span className="text-gray-900 font-medium">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <FAQ />

                {/* Enhanced Reviews Section */}
                <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex flex-col gap-2 sm:flex-row justify-start sm:justify-between sm:items-center mb-8">
                        <h2 className="sm:text-3xl font-bold text-gray-900 flex  items-center gap-3">
                            <MessageCircle className="w-8 h-8 text-blue-600" />
                            Customer Reviews
                        </h2>
                        {!currentUser && !showReviewForm ? (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                Login to Review
                            </button>
                        ) : !userReview && !showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Write Review
                            </button>
                        )}
                    </div>

                    {showReviewForm && (
                        <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                            <ReviewForm
                                productId={id}
                                productType={type}
                                existingReview={userReview}
                                onReviewSubmitted={handleReviewSubmitted}
                            />
                        </div>
                    )}

                    <ReviewList
                        reviews={reviews}
                        onEdit={currentUser ? handleEditReview : undefined}
                        onDelete={currentUser ? handleDeleteReview : undefined}
                    />

                    {pagination && pagination.hasNextPage && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => fetchReviews(pagination.nextPage)}
                                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Load More Reviews
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegularProductDetail;
