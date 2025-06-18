import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { img_url } from '../config/api_route';
import { productService } from '../services/product.service';
import { reviewService } from '../services/review.service';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { toast } from 'react-hot-toast';

const SolarProductDetail = () => {
    const { type, id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

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

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!product) {
        return <div className="text-center py-8">Product not found</div>;
    }

    // Helper function to check if product is a solar product
    const isSolarProduct = () => {
        const categoryName = product.category?.name?.toLowerCase();
        const productType = product.type?.toLowerCase();
        return categoryName === 'solar' ||
            productType?.includes('pcu') ||
            productType?.includes('solar');
    };

    if (!isSolarProduct()) {
        console.log('Not a solar product, returning null');
        return null;
    }

    // Get all available images
    const allImages = product.images || [product.image];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-28">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Enhanced Image Gallery */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-xl group relative">
                            <img
                                src={img_url + allImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Image Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {allImages.map((image, index) => (
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
                                            alt={`${product.name} - View ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Enhanced Product Info */}
                    <div className="space-y-8">
                        {/* Brand Section */}
                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg">
                            <img
                                src={img_url + product.brand?.logo}
                                alt={product.brand?.name}
                                className="w-16 h-16 rounded-lg object-contain bg-gray-50 p-2"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{product.brand?.name}</h3>
                                <p className="text-sm text-gray-600">Official Brand Partner</p>
                            </div>
                        </div>

                        {/* Product Name and Type */}
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                            <p className="text-lg text-[#008246] font-medium capitalize">{product.type}</p>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Description</h3>
                            <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                        </div>

                        {/* Specifications */}
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.modelName && (
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-500">Model Name</span>
                                        <p className="font-medium text-gray-900">{product.modelName}</p>
                                    </div>
                                )}
                                {product.power && (
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-500">Power Rating</span>
                                        <p className="font-medium text-gray-900">{product.power}W</p>
                                    </div>
                                )}
                                {product.weight && (
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-500">Weight</span>
                                        <p className="font-medium text-gray-900">{product.weight}kg</p>
                                    </div>
                                )}
                                {product.dimension && (
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-500">Dimensions</span>
                                        <p className="font-medium text-gray-900">{product.dimension}</p>
                                    </div>
                                )}
                                {product.warranty && (
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-500">Warranty</span>
                                        <p className="font-medium text-gray-900">{product.warranty} months</p>
                                    </div>
                                )}
                                {product.replacementPolicy && (
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-500">Replacement Policy</span>
                                        <p className="font-medium text-gray-900">{product.replacementPolicy}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Features */}
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

                        {/* Enhanced Call to Action */}
                        <div className="bg-gradient-to-r from-[#008246] to-[#009c55] rounded-2xl p-8 shadow-xl">
                            <div className="text-center space-y-6">
                                <h3 className="text-3xl font-bold text-white">Product Price</h3>
                                <div className="text-4xl font-bold text-white mb-4">
                                    ₹{product.price ? product.price.toLocaleString() : 'Contact for Price'}
                                </div>
                                <p className="text-white/90 text-lg">Get this high-quality solar product at the best price.</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => navigate('/contact')}
                                        className="bg-white text-[#008246] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => navigate('/contact?type=inquiry')}
                                        className="bg-[#E4C73F] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#f7da5e] transition-colors duration-200 shadow-lg"
                                    >
                                        Contact Sales
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
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

export default SolarProductDetail; 