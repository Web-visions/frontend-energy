import React, { useEffect, useState } from 'react';
import { getData } from '../utils/http';
import { useNavigate } from 'react-router-dom';
import { img_url } from '../config/api_route';

const InverterSect = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch 6 latest featured products
    getData('/products/featured', { limit: 8 })
      .then(data => setProducts(data.data || []))
      .catch(() => setProducts([]));
  }, []);

  const handleViewDetails = (prodType, id) => {
    navigate(`/product/${prodType}/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-20 bg-gradient-to-b from-white via-[#f7fafd] to-[#eafaf2]">
      {/* Featured Products Section */}
      <section>
        <h1 className="text-3xl md:text-4xl font-black mb-10 text-center md:text-left text-[#008246] relative">
          Featured Products
          <span className="absolute left-1/2 md:left-0 -bottom-2 w-28 h-1 bg-[#E4C73F] rounded-full -translate-x-1/2 md:translate-x-0 transition-all duration-300"></span>
        </h1>
        <div className="flex justify-start">
          <div className="flex flex-wrap gap-8 justify-center">
            {products.map((product) => {
              const displayPrice = product.sellingPrice || product.price || product.mrp;
              const hasDiscount = product.mrp > displayPrice;
              let imagePath = '';
              if (Array.isArray(product.images) && product.images.length > 0) {
                imagePath = product.images[0];
              } else if (product.image) {
                imagePath = product.image;
              } else {
                imagePath = '/default-image.png'; // fallback image
              }

              const fullImageUrl = `${img_url}/${imagePath}`;

              return (
                <div
                  key={product._id}
                  className="w-full sm:w-[320px] bg-white rounded-2xl shadow-md group hover:shadow-2xl overflow-hidden transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                    <img
                      src={fullImageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain object-center"
                    />
                    {product.featured && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 rounded z-10 text-xs font-bold shadow">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">{product.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {product.brand?.logo && (
                        <img src={img_url + product.brand.logo} alt={product.brand.name} className="w-7 h-7 object-contain rounded-full border" />
                      )}
                      <span className="text-sm font-bold text-[#008246]">{product.brand?.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 text-center mb-2">{product.category?.name}</div>
                    <p className="text-gray-600 text-sm my-2 text-center line-clamp-3 min-h-[60px]">{product.description}</p>
                    <div className="flex items-center justify-center gap-2 mt-2 mb-4">
                      <span className="text-2xl font-bold text-gray-800">₹{displayPrice?.toLocaleString()}</span>
                      {hasDiscount && (
                        <span className="text-lg text-gray-400 line-through">₹{product.mrp?.toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      className="w-full mt-auto py-2 bg-gradient-to-r from-[#E4C73F] to-[#ffe477] text-black font-bold rounded-lg shadow hover:bg-[#d4b82f] hover:scale-[1.02] transition-all"
                      onClick={() => handleViewDetails(product.prodType, product._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InverterSect;