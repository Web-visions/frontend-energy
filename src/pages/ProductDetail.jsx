import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import { useCart } from '../context/CartContext';
import { img_url } from '../config/api_route';

const ProductDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProduct(type, id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [type, id]);

  const handleAddToCart = async () => {
    const success = await addToCart(type, id, quantity);
    if (success) {
      // Show success message
    } else {
      // Show error message
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

  const renderSpecifications = () => {
    if (!product) return [];

    const specs = [];
    const categoryName = product.category?.name?.toLowerCase();

    switch (categoryName) {
      case 'invertor':
        specs.push(
          { label: 'Capacity', value: `${product.capacity}VA` },
          { label: 'Dimensions', value: product.dimension },
          { label: 'Warranty', value: product.warranty }
        );
        break;
      case 'ups':
        specs.push(
          { label: 'Output Power', value: `${product.outputPowerWattage}W` },
          { label: 'Input Voltage', value: `${product.inputVoltage}V` },
          { label: 'Output Voltage', value: `${product.outputVoltage}V` },
          { label: 'Input Frequency', value: `${product.inputFreq}Hz` },
          { label: 'Output Frequency', value: `${product.outputFreq}Hz` },
          { label: 'Dimensions', value: product.dimension },
          { label: 'Warranty', value: product.warranty }
        );
        break;
      case 'solar pcu':
        specs.push(
          { label: 'Type', value: product.type_detail },
          { label: 'Wattage', value: `${product.wattage}W` },
          { label: 'Model Name', value: product.modelName },
          { label: 'Weight', value: `${product.weight}kg` },
          { label: 'Dimensions', value: product.dimension },
          { label: 'Warranty', value: product.warranty }
        );
        break;
      case 'solar pv':
        specs.push(
          { label: 'Model Name', value: product.modelName },
          { label: 'SKU', value: product.sku },
          { label: 'Type', value: product.type_detail },
          { label: 'Weight', value: `${product.weight}kg` },
          { label: 'Dimensions', value: product.dimension },
          { label: 'Manufacturer', value: product.manufacturer },
          { label: 'Warranty', value: product.replacementPolicy }
        );
        break;
      case 'solar street light':
        specs.push(
          { label: 'Model Name', value: product.modelName },
          { label: 'Power', value: `${product.power}W` },
          { label: 'Warranty', value: product.replacementPolicy }
        );
        break;
    }

    return specs;
  };

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

  const images = img_url + product.images || img_url + [product.image];
  const isSolarProduct = ['solar pcu', 'solar pv', 'solar street light'].includes(product.category?.name?.toLowerCase());
  const averageRating = calculateAverageRating(product.reviews);

  return (
    <div className="min-h-screen bg-gray-50 mt-28">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg group">
              {(!product.images || product.images.length === 0) ? (
                <img
                  src={img_url + product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <img
                  src={img_url + product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>

            {/* Thumbnails - Only show if there are multiple images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img
                      src={img_url + image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img
                src={img_url + product.brand?.logo}
                alt={product.brand?.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{product.brand?.name}</h3>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {renderStars(averageRating)}
              </div>
              <span className="text-lg font-medium text-gray-900">{averageRating}</span>
              <span className="text-gray-600">({product.reviews?.length || 0} reviews)</span>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-6">
              {isSolarProduct ? (
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#008246] mb-3">Request Quote</p>
                  <p className="text-gray-600 mb-4">Pricing available on request. Contact us for custom quotation.</p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full bg-[#008246] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#009c55] transition-colors duration-200"
                  >
                    Get Quote
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-[#008246]">
                      ₹{(product.sellingPrice || product.mrp).toLocaleString()}
                    </span>
                    {product.mrp > (product.sellingPrice || product.mrp) && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ₹{product.mrp.toLocaleString()}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                          {Math.round(((product.mrp - (product.sellingPrice || product.mrp)) / product.mrp) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
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

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#008246] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#009c55] transition-colors duration-200"
                    >
                      Add to Cart
                    </button>
                    <button className="flex-1 bg-[#E4C73F] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#f7da5e] transition-colors duration-200">
                      Buy Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Key Features */}
            {product.features && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {product.staticTags && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.staticTags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
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
            <div className="px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-900">Product Details</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="space-y-3">
                  {renderSpecifications().map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
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
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="px-6 py-4">
                <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {review.user?.name?.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.user?.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;