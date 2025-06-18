import React from 'react';
import { format } from 'date-fns';

const ReviewList = ({ reviews, onEdit, onDelete }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review this product!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                    {/* Review Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`text-xl ${star <= review.rating
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-gray-600">
                                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                </span>
                            </div>
                            <h4 className="font-semibold mt-1">{review.user.name}</h4>
                        </div>
                        {onEdit && onDelete && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(review)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(review._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Review Content */}
                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {review.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded"
                                />
                            ))}
                        </div>
                    )}

                    {/* Verification Badge */}
                    {review.isVerified && (
                        <div className="mt-4 flex items-center gap-2 text-green-600">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span className="text-sm">Verified Purchase</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList; 