import axios from 'axios';
import { backend_url as API_URL } from '../config/api_route';
import { postData } from '../utils/http';

const createReview = async (reviewData) => {
    const formData = new FormData();
    Object.keys(reviewData).forEach(key => {
        if (key === 'images') {
            reviewData[key].forEach(image => {
                formData.append('images', image);
            });
        } else {
            formData.append(key, reviewData[key]);
        }
    });

    const response = postData(`/reviews`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data;
};

const getProductReviews = async (productId) => {
    const response = await axios.get(`${API_URL}/reviews/product/${productId}`);
    return response.data;
};

const updateReview = async (reviewId, reviewData) => {
    const formData = new FormData();
    Object.keys(reviewData).forEach(key => {
        if (key === 'images') {
            reviewData[key].forEach(image => {
                formData.append('images', image);
            });
        } else {
            formData.append(key, reviewData[key]);
        }
    });

    const response = await axios.put(`${API_URL}/reviews/${reviewId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const deleteReview = async (reviewId) => {
    const response = await axios.delete(`${API_URL}/reviews/${reviewId}`);
    return response.data;
};

const getUserReviews = async () => {
    const response = await axios.get(`${API_URL}/reviews/user`);
    return response.data;
};

export const reviewService = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getUserReviews
}; 