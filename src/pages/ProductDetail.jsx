import { useState } from 'react';

// Mock Data for all product types
const mockProducts = {
  inverter: {
    id: '1',
    type: 'inverter',
    name: 'Luminous Zelio+ 1100 Home Pure Sine Wave Inverter',
    image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Advanced pure sine wave inverter with intelligent battery management system and overload protection for reliable home backup power.',
    features: [
      'Pure Sine Wave Output',
      'Intelligent Battery Management',
      'Overload Protection',
      'Short Circuit Protection',
      'LED Display',
      'Bypass Switch'
    ],
    brand: {
      name: 'Luminous',
      logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=200',
      description: 'Leading manufacturer of power backup solutions in India'
    },
    category: 'Power Solutions',
    dimension: '315 x 185 x 155 mm',
    capacity: 1100,
    warranty: '2 Years',
    mrp: 8500,
    priceWithoutOldBattery: 7200,
    priceWithOldBattery: 6800,
    reviews: [
      { id: 1, user: 'Rajesh Kumar', rating: 5, comment: 'Excellent inverter, works perfectly during power cuts', date: '2024-01-15' },
      { id: 2, user: 'Priya Sharma', rating: 4, comment: 'Good quality product, reliable performance', date: '2024-01-10' }
    ]
  },
  ups: {
    id: '2',
    type: 'ups',
    name: 'APC Back-UPS Pro 1500VA/865W UPS',
    image: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Professional grade UPS with automatic voltage regulation and surge protection for critical equipment protection.',
    features: [
      'Automatic Voltage Regulation',
      'Surge Protection',
      'LCD Display',
      'USB Connectivity',
      'Hot-swappable Batteries',
      'Energy Saving Mode'
    ],
    brand: {
      name: 'APC',
      logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=200',
      description: 'Global leader in UPS and power protection solutions'
    },
    category: 'UPS Systems',
    type_detail: 'Interactive',
    outputPowerWattage: 865,
    inputVoltage: 230,
    outputVoltage: 230,
    inputFreq: 50,
    outputFreq: 50,
    dimension: '165 x 440 x 218 mm',
    warranty: '3 Years',
    mrp: 15500,
    sellingPrice: 13200,
    reviews: [
      { id: 1, user: 'Amit Patel', rating: 5, comment: 'Reliable UPS for office use, excellent backup time', date: '2024-01-12' },
      { id: 2, user: 'Neha Singh', rating: 4, comment: 'Good build quality, works as expected', date: '2024-01-08' }
    ]
  },
  solarPCU: {
    id: '3',
    type: 'solarPCU',
    name: 'Luminous Solar Hybrid PCU NXG1800 12V',
    image: 'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Advanced hybrid solar PCU with MPPT charge controller for maximum solar energy utilization and grid integration.',
    features: [
      'MPPT Charge Controller',
      'Grid Tie Functionality',
      'Battery Management System',
      'LCD Display',
      'Remote Monitoring',
      'Weather Protection'
    ],
    brand: {
      name: 'Luminous',
      logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=200',
      description: 'Leading manufacturer of solar power solutions'
    },
    category: 'Solar Equipment',
    type_detail: 'Hybrid PCU',
    wattage: 1800,
    modelName: 'NXG1800',
    staticTags: ['Solar', 'Hybrid', 'MPPT', 'Grid Tie'],
    warranty: '5 Years',
    dimension: '420 x 280 x 150 mm',
    weight: 12.5,
    reviews: [
      { id: 1, user: 'Suresh Gupta', rating: 5, comment: 'Excellent solar PCU, great efficiency', date: '2024-01-14' },
      { id: 2, user: 'Kavita Joshi', rating: 4, comment: 'Good performance, easy installation', date: '2024-01-09' }
    ]
  },
  solarPVModule: {
    id: '4',
    type: 'solarPVModule',
    name: 'Tata Solar Panel 540W Monocrystalline',
    images: [
      'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'High-efficiency monocrystalline solar panel with superior performance and durability for residential and commercial applications.',
    brand: {
      name: 'Tata Solar',
      logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=200',
      description: 'Trusted name in renewable energy solutions'
    },
    category: 'Solar Panels',
    modelName: 'TP540M-72',
    sku: 'TSP540M2024',
    type_detail: 'Monocrystalline',
    weight: 27.5,
    dimension: '2278 x 1134 x 35 mm',
    manufacturer: 'Tata Power Solar Systems Ltd.',
    packer: 'Tata Power Solar Systems Ltd.',
    importer: 'Not Applicable',
    replacementPolicy: '25 Years Performance Warranty',
    staticTags: ['High Efficiency', 'Monocrystalline', 'Tier-1', 'Weather Resistant'],
    reviews: [
      { id: 1, user: 'Vikram Mehta', rating: 5, comment: 'Excellent solar panels, great quality', date: '2024-01-13' },
      { id: 2, user: 'Sunita Rao', rating: 5, comment: 'Outstanding performance, highly recommended', date: '2024-01-07' }
    ]
  },
  solarStreetLight: {
    id: '5',
    type: 'solarStreetLight',
    name: 'Philips Solar LED Street Light 30W',
    image: 'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Smart solar LED street light with motion sensor and automatic dusk-to-dawn operation for efficient outdoor lighting.',
    brand: {
      name: 'Philips',
      logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=200',
      description: 'Global leader in lighting solutions'
    },
    category: 'Solar Lighting',
    modelName: 'SSL-30W-2024',
    power: 30,
    replacementPolicy: '3 Years Product Warranty',
    staticTags: ['Motion Sensor', 'Auto On/Off', 'Weather Proof', 'Energy Efficient'],
    reviews: [
      { id: 1, user: 'Municipal Corp Delhi', rating: 4, comment: 'Good quality street lights, energy efficient', date: '2024-01-11' },
      { id: 2, user: 'Residential Society', rating: 5, comment: 'Excellent brightness and battery backup', date: '2024-01-06' }
    ]
  }
};

const ProductDetails = () => {
  const [selectedProduct, setSelectedProduct] = useState('inverter');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts[selectedProduct];
  const images = product.images || [product.image];
  const isSolarProduct = ['solarPCU', 'solarPVModule', 'solarStreetLight'].includes(product.type);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setSelectedImageIndex(0);
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
    const specs = [];
    
    switch (product.type) {
      case 'inverter':
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
      case 'solarPCU':
        specs.push(
          { label: 'Type', value: product.type_detail },
          { label: 'Wattage', value: `${product.wattage}W` },
          { label: 'Model Name', value: product.modelName },
          { label: 'Weight', value: `${product.weight}kg` },
          { label: 'Dimensions', value: product.dimension },
          { label: 'Warranty', value: product.warranty }
        );
        break;
      case 'solarPVModule':
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
      case 'solarStreetLight':
        specs.push(
          { label: 'Model Name', value: product.modelName },
          { label: 'Power', value: `${product.power}W` },
          { label: 'Warranty', value: product.replacementPolicy }
        );
        break;
    }
    
    return specs;
  };

  const averageRating = calculateAverageRating(product.reviews);

  return (
    <div className="min-h-screen bg-gray-50 mt-28">
      {/* Product Selector */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Select Product:</label>
            <select 
              value={selectedProduct} 
              onChange={handleProductChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="inverter">Inverter</option>
              <option value="ups">UPS</option>
              <option value="solarPCU">Solar PCU</option>
              <option value="solarPVModule">Solar PV Module</option>
              <option value="solarStreetLight">Solar Street Light</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg group">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'border-blue-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
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
                src={product.brand.logo}
                alt={product.brand.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{product.brand.name}</h3>
                <p className="text-sm text-gray-600">{product.brand.description}</p>
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
              <span className="text-gray-600">({product.reviews.length} reviews)</span>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-6">
              {isSolarProduct ? (
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 mb-3">Request Quote</p>
                  <p className="text-gray-600 mb-4">Pricing available on request. Contact us for custom quotation.</p>
                  <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200">
                    Get Quote
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    {product.priceWithoutOldBattery && (
                      <span className="text-3xl font-bold text-green-600">₹{product.priceWithoutOldBattery.toLocaleString()}</span>
                    )}
                    {product.sellingPrice && (
                      <span className="text-3xl font-bold text-green-600">₹{product.sellingPrice.toLocaleString()}</span>
                    )}
                    <span className="text-xl text-gray-500 line-through">₹{product.mrp.toLocaleString()}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {Math.round(((product.mrp - (product.priceWithoutOldBattery || product.sellingPrice)) / product.mrp) * 100)}% OFF
                    </span>
                  </div>
                  
                  {product.priceWithOldBattery && (
                    <p className="text-green-600 font-medium mb-4">
                      With old battery exchange: ₹{product.priceWithOldBattery.toLocaleString()}
                    </p>
                  )}

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
                    <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                      Add to Cart
                    </button>
                    <button className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200">
                      Buy Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

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
        <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {review.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{review.user}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-600">{review.date}</span>
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
      </div>
    </div>
  );
};

export default ProductDetails;