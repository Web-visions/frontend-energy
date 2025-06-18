import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/product.service';
import RegularProductDetail from '../components/RegularProductDetail';

const ProductDetails = () => {
  const { type, id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with type:', type, 'and id:', id);
        const data = await productService.getProduct(type, id);
        console.log('Received product data:', data);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  // Use RegularProductDetail for all products including solar products
  // since it now handles solar products with pricing
  return <RegularProductDetail />;
};

export default ProductDetails;