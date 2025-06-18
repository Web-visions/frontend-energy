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

const RegularProductDetail = () => {
    const { type, id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [hasOldBattery, setHasOldBattery] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productData, reviewsData] = await Promise.all([
                    productService.getProduct(type, id),
                    reviewService.getProductReviews(id)
                ]);
                setProduct(productData);
                setReviews(reviewsData.reviews);
                setUserReview(reviewsData.userReview);
            } catch (err) {
                setError(err.message);
                toast.error('Error loading product details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type, id]);

    const handleAddToCart = async () => {
        try {
            const success = await addToCart(type, product._id, quantity);
            if (success) {
                toast.success('Product added to cart successfully!');
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
            stars.push(<span key={i} className="text-yellow-400">★</span>);
        }

        if (hasHalfStar) {
            stars.push(<span key="half" className="text-yellow-400">☆</span>);
        }

        for (let i = stars.length; i < 5; i++) {
            stars.push(<span key={i} className="text-gray-300">☆</span>);
        }

        return stars;
    };

    const handleReviewSubmitted = async () => {
        try {
            const { reviews: updatedReviews, userReview: updatedUserReview } =
                await reviewService.getProductReviews(id);
            setReviews(updatedReviews);
            setUserReview(updatedUserReview);
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
            const { reviews: updatedReviews, userReview: updatedUserReview } =
                await reviewService.getProductReviews(id);
            setReviews(updatedReviews);
            setUserReview(updatedUserReview);
            toast.success('Review deleted successfully');
        } catch (err) {
            toast.error('Error deleting review');
        }
    };

    const getProductPrice = () => {
        // Handle solar products
        if (product?.category?.name?.toLowerCase() === 'solar' || 
            product?.type?.toLowerCase()?.includes('pcu') || 
            product?.type?.toLowerCase()?.includes('solar')) {
            return product?.price;
        }
        
        // Handle regular products
        if (product?.category?.name?.toLowerCase() === 'battery' || product?.category?.name?.toLowerCase() === 'inverter') {
            return hasOldBattery ? product.priceWithOldBattery : product.priceWithoutOldBattery;
        }
        return product?.sellingPrice || product?.mrp;
    };

    const renderSpecifications = () => {
        if (!product) return [];

        const specs = [];
        const categoryName = product.category?.name?.toLowerCase();
        const productType = product.type?.toLowerCase();

        // Handle solar products
        if (categoryName === 'solar' || productType?.includes('pcu') || productType?.includes('solar')) {
            // Solar PCU specifications
            if (productType?.includes('pcu')) {
                specs.push(
                    { label: 'Type', value: product.type },
                    { label: 'Wattage', value: product.wattage ? `${product.wattage}W` : 'N/A' },
                    { label: 'Model Name', value: product.modelName || 'N/A' },
                    { label: 'Warranty', value: product.warranty || 'N/A' },
                    { label: 'Dimensions', value: product.dimension || 'N/A' },
                    { label: 'Weight', value: product.weight ? `${product.weight}kg` : 'N/A' }
                );
            }
            // Solar PV Module specifications
            else if (productType?.includes('polycrystalline') || productType?.includes('monocrystalline')) {
                specs.push(
                    { label: 'Type', value: product.type || 'N/A' },
                    { label: 'Model Name', value: product.modelName || 'N/A' },
                    { label: 'SKU', value: product.sku || 'N/A' },
                    { label: 'Weight', value: product.weight ? `${product.weight}kg` : 'N/A' },
                    { label: 'Dimensions', value: product.dimension || 'N/A' },
                    { label: 'Manufacturer', value: product.manufacturer || 'N/A' },
                    { label: 'Packer', value: product.packer || 'N/A' },
                    { label: 'Importer', value: product.importer || 'N/A' },
                    { label: 'Replacement Policy', value: product.replacementPolicy || 'N/A' }
                );
            }
            // Solar Street Light specifications
            else {
                specs.push(
                    { label: 'Model Name', value: product.modelName || 'N/A' },
                    { label: 'Power', value: product.power ? `${product.power}W` : 'N/A' },
                    { label: 'Replacement Policy', value: product.replacementPolicy || 'N/A' }
                );
            }
            return specs;
        }

        // Handle regular products
        switch (categoryName) {
            case 'inverter':
                specs.push(
                    { label: 'Capacity', value: `${product.capacity}VA` },
                    { label: 'Dimensions', value: product.dimension },
                    { label: 'Warranty', value: product.warranty }
                );
                break;
            case 'ups':
                specs.push(
                    { label: 'Type', value: product.type },
                    { label: 'Output Power', value: `${product.outputPowerWattage}W` },
                    { label: 'Input Voltage', value: `${product.inputVoltage}V` },
                    { label: 'Output Voltage', value: `${product.outputVoltage}V` },
                    { label: 'Input Frequency', value: `${product.inputFreq}Hz` },
                    { label: 'Output Frequency', value: `${product.outputFreq}Hz` },
                    { label: 'Dimensions', value: product.dimension },
                    { label: 'Warranty', value: product.warranty }
                );
                break;
            case 'battery':
                specs.push(
                    { label: 'Battery Type', value: product.batteryType },
                    { label: 'Capacity', value: `${product.AH}Ah` },
                    { label: 'Weight', value: product.nominalFilledWeight },
                    { label: 'Dimensions', value: product.dimension },
                    { label: 'Warranty', value: product.warranty }
                );
                break;
        }

        return specs;
    };

    const averageRating = calculateAverageRating(product?.reviews);
    const currentPrice = getProductPrice();

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!product) {
        return <div className="text-center py-8">Product not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-28">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-xl group relative">
                            <img
                                src={img_url + (product.images?.[selectedImage] || product.image)}
                                alt={product.name}
                                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.src = noImageFound;
                                }}
                            />
                        </div>

                        {/* Thumbnails */}
                        {(product.images && product.images.length > 1) && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                                            ? 'border-[#008246] shadow-lg scale-105'
                                            : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={img_url + image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-contain p-2"
                                            onError={(e) => {
                                                e.target.src = noImageFound;
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        {/* Brand */}
                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg">
                            <img
                                src={img_url + product.brand?.logo}
                                alt={product.brand?.name}
                                className="w-16 h-16 rounded-lg object-contain bg-gray-50 p-2"
                                onError={(e) => {
                                    e.target.src = noImageFound;
                                }}
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{product.brand?.name}</h3>
                                <p className="text-sm text-gray-600">Official Brand Partner</p>
                            </div>
                        </div>

                        {/* Product Name */}
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                            <p className="text-lg text-[#008246] font-medium capitalize">{product.category?.name}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center">
                                {renderStars(averageRating)}
                            </div>
                            <span className="text-lg font-medium text-gray-900">{averageRating}</span>
                            <span className="text-gray-600">({product.reviews?.length || 0} reviews)</span>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <div className="space-y-6">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-[#008246]">
                                        ₹{currentPrice?.toLocaleString() || 'Contact for Price'}
                                    </span>
                                    {product.mrp > currentPrice && (
                                        <>
                                            <span className="text-xl text-gray-500 line-through">
                                                ₹{product.mrp?.toLocaleString()}
                                            </span>
                                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                                                {Math.round(((product.mrp - currentPrice) / product.mrp) * 100)}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Old Battery Exchange Option - Only for battery and inverter products */}
                                {(product.category?.name?.toLowerCase() === 'battery' || product.category?.name?.toLowerCase() === 'inverter') && 
                                 !product.type?.toLowerCase()?.includes('pcu') && !product.type?.toLowerCase()?.includes('solar') && (
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={hasOldBattery}
                                                onChange={(e) => setHasOldBattery(e.target.checked)}
                                                className="w-4 h-4 text-[#008246] rounded border-gray-300 focus:ring-[#008246]"
                                            />
                                            <span className="text-gray-700">I have an old battery to exchange</span>
                                        </label>
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-[#008246] text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-[#009c55] transition-colors duration-200 shadow-lg"
                                    >
                                        Add to Cart
                                    </button>
                                    <button className="flex-1 bg-[#E4C73F] text-black px-6 py-4 rounded-xl font-semibold text-lg hover:bg-[#f7da5e] transition-colors duration-200 shadow-lg">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Key Features */}
                        {product.features && (
                            <div className="bg-white rounded-xl p-8 shadow-lg">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Key Features</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="mt-1.5 w-2 h-2 bg-[#008246] rounded-full flex-shrink-0"></span>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tags */}
                        {product.staticTags && product.staticTags.length > 0 && (
                            <div className="bg-white rounded-xl p-8 shadow-lg">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Tags</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.staticTags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-[#008246]/10 text-[#008246] px-4 py-2 rounded-full text-sm font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200">
                        <div className="px-8 py-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Product Details</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Description */}
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Description</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                            </div>

                            {/* Specifications */}
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Specifications</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {renderSpecifications().map((spec, index) => (
                                        <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">{spec.label}</span>
                                            <span className="text-gray-900">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        {!userReview && !showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>

                    {showReviewForm && (
                        <div className="mb-8">
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
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                    />
                </div>
            </div>
        </div>
    );
};

export default RegularProductDetail; 