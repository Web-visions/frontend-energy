import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewService } from '../services/review.service';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ productId, productType, existingReview, onReviewSubmitted }) => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState(existingReview?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                product: productId,
                productType,
                rating,
                comment,
                images
            };

            if (existingReview) {
                await reviewService.updateReview(existingReview._id, reviewData);
                toast.success('Review updated successfully');
            } else {
                await reviewService.createReview(reviewData);
                toast.success('Review submitted successfully');
            }

            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>

            {/* Rating Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your Review</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Share your experience with this product..."
                    required
                />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Add Photos (Optional)</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full"
                />
                {previewImages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {previewImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
            </button>
        </form>
    );
};

export default ReviewForm; 