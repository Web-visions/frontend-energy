import React, { useState } from 'react';
import { X, Heart, Share2, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';

const AddtoCartPage = () => {
  const [mainImage, setMainImage] = useState('https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg');
  const [quantity, setQuantity] = useState(1);

  const images = [
    'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg',
    'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg',
    'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
    'https://images.pexels.com/photos/1181325/pexels-photo-1181325.jpeg'
  ];

  const features = [
    { icon: Truck, text: "Free Delivery" },
    { icon: Shield, text: "2 Year Warranty" },
    { icon: RotateCcw, text: "7 Day Return" }
  ];

  const relatedProducts = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Premium Battery ${i + 1}`,
    oldPrice: 6000 + (i * 500),
    newPrice: 4500 + (i * 500),
    image: images[i % images.length],
    rating: 4.5
  }));

  return (
    <div className="max-w-[1280px] mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 relative">
        <button className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors">
          <X size={28} />
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Section - Images */}
          <div className="w-full lg:w-[60%] flex gap-6">
            <div className="w-24 space-y-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`View ${i + 1}`}
                  className={`w-full rounded-lg cursor-pointer transition-all ${
                    mainImage === img ? 'border-2 border-[#008246]' : 'border border-gray-200 hover:border-gray-300'
                  }`}
                  onMouseEnter={() => setMainImage(img)}
                />
              ))}
            </div>
            
            <div className="flex-1 relative group">
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full rounded-xl border border-gray-200"
              />
              <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <Heart size={20} className="text-gray-700" />
                </button>
                <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <Share2 size={20} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="w-full lg:w-[40%] space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Exide MaxPower 12V Battery</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#E4C73F]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#E4C73F" />
                  ))}
                </div>
                <span className="text-gray-500">(128 reviews)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#008246]">₹4,500</span>
                <span className="text-xl text-gray-400 line-through">₹6,000</span>
                <span className="bg-[#E4C73F] text-black px-3 py-1 rounded-full text-sm font-semibold">
                  25% OFF
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-200">{quantity}</span>
                  <button 
                    className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-500">12 units left</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-[#008246] text-white py-3 rounded-lg font-semibold hover:bg-[#006a38] transition-colors">
                Buy Now
              </button>
              <button className="flex items-center justify-center gap-2 flex-1 border-2 border-[#008246] text-[#008246] py-3 rounded-lg font-semibold hover:bg-[#008246] hover:text-white transition-colors">
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              {features.map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <feature.icon size={24} className="text-[#008246] mb-2" />
                  <span className="text-sm text-gray-600">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-2">Product Description</h3>
              <p className="text-gray-600">
                Experience unmatched power and reliability with our premium battery. 
                Featuring advanced technology for longer life, faster charging, and 
                superior performance in all conditions. Perfect for both home and 
                commercial use.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white text-black px-6 py-2 rounded-full font-semibold transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-[#008246]">₹{product.newPrice}</p>
                    <p className="text-sm text-gray-500 line-through">₹{product.oldPrice}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#E4C73F]">
                    <Star size={16} fill="#E4C73F" />
                    <span className="text-gray-700">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddtoCartPage;