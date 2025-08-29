import React, { useEffect, useState } from "react";
import { getData } from "../utils/http";
import { useNavigate } from "react-router-dom";
import { img_url } from "../config/api_route";

const InverterSect = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData("/products/featured", { limit: 8 })
      .then((response) => setFeaturedProducts(response.data || []))
      .catch(() => setFeaturedProducts([]));
  }, []);

  const handleViewDetails = (productType, productId) => {
    navigate(`/product/${productType}/${productId}`);
  };

  return (
    <div className="bg-gradient-to-b from-white via-[#f7fafd] to-[#eafaf2]">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Section header */}
        <div className="text-center md:text-left mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#008246] relative inline-block md:block">
            Featured Products
            <span className="absolute left-1/2 md:left-0 -bottom-2 w-24 sm:w-28 h-1 bg-[#E4C73F] rounded-full -translate-x-1/2 md:translate-x-0" />
          </h1>
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {featuredProducts.map((product, index) => {
            const displayPrice =
              product.sellingPrice || product.price || product.mrp;
            const hasDiscount =
              product.mrp && displayPrice && product.mrp > displayPrice;

            // image selection
            const imagePath =
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : product.image || "/default-image.png";
            const fullImageUrl = `${img_url}/${imagePath}`;

            return (
              <article
                key={product._id}
                className="group bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300"
              >
                {/* Media with stable aspect ratio */}
                <div className="relative bg-gray-50">
                  <div className="w-full aspect-[4/3] flex items-center justify-center">
                    <img
                      src={fullImageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-4 sm:p-5"
                    />
                  </div>

                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-white px-2 py-1 rounded text-[10px] sm:text-xs font-bold shadow">
                      Featured
                    </span>
                  )}

                  {index < 3 && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded text-[10px] sm:text-xs font-bold shadow">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  {/* Brand and category */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {product.brand?.logo ? (
                      <img
                        src={img_url + product.brand.logo}
                        alt={product.brand?.name}
                        className="h-6 w-6 sm:h-7 sm:w-7 object-contain rounded-full border bg-white"
                        loading="lazy"
                      />
                    ) : null}
                    <span className="text-xs sm:text-sm font-semibold text-[#008246]">
                      {product.brand?.name}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-gray-500 text-center mb-1">
                    {product.category?.name}
                  </p>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                    {product.name}
                  </h3>

                  {/* Description */}
                  {product.description ? (
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 mb-3 text-center line-clamp-3 min-h-[3.5rem]">
                      {product.description}
                    </p>
                  ) : (
                    <div className="mb-3" />
                  )}

                  {/* Price */}
                  <div className="mt-auto mb-4 sm:mb-5">
                    {displayPrice ? (
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          ₹{displayPrice.toLocaleString()}
                        </p>
                        {hasDiscount && (
                          <p className="text-sm sm:text-base text-gray-400 line-through">
                            ₹{product.mrp.toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-base sm:text-lg font-semibold text-blue-600 text-center">
                        Contact for Price
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() =>
                      handleViewDetails(product.prodType, product._id)
                    }
                    className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#E4C73F] to-[#ffe477] text-black font-bold rounded-lg shadow transition-all duration-200 hover:brightness-95 active:translate-y-[1px]"
                  >
                    View Details
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default InverterSect;
