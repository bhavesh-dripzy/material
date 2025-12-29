import React, { useEffect, useState } from 'react';
import { Product, CartItem } from '../../types';
import { apiService, ApiProduct } from '../../services/api';
import { mapApiProductToProduct } from '../../utils/productMapper';

interface ProductDetailPageProps {
  productId: string;
  onAdd: (product: Product) => void;
  onRemove?: (productId: string) => void;
  cartQuantity?: number;
  onBack: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onAdd,
  onRemove,
  cartQuantity = 0,
  onBack,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [apiProduct, setApiProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productIdNum = parseInt(productId);
        if (isNaN(productIdNum)) {
          console.error('Invalid product ID:', productId);
          return;
        }

        const response = await apiService.getProductDetail(productIdNum);
        if (response.success && response.result) {
          setApiProduct(response.result);
          const mappedProduct = mapApiProductToProduct(response.result);
          setProduct(mappedProduct);
        } else {
          console.error('Failed to fetch product:', response.error);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="pb-32">
        <div className="text-center py-12 text-gray-400 text-sm font-bold">Loading product...</div>
      </div>
    );
  }

  if (!product || !apiProduct) {
    return (
      <div className="pb-32">
        <div className="text-center py-12 text-gray-400 text-sm font-bold">Product not found</div>
        <button
          onClick={onBack}
          className="mx-auto mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const images = apiProduct.images && apiProduct.images.length > 0 
    ? apiProduct.images 
    : apiProduct.image_url 
      ? [apiProduct.image_url] 
      : [];

  const mainImage = images[selectedImageIndex] || product.image;

  return (
    <div className="pb-32 bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h2 className="text-sm font-black uppercase tracking-tight flex-1">Product Details</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-50">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={() => setSelectedImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedImageIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 py-4">
        {/* Category Badge */}
        {apiProduct.category && (
          <div className="mb-2">
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase">
              {apiProduct.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight leading-tight">
          {product.name}
        </h1>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-[1000] text-gray-900">₹{product.price}</span>
            {apiProduct.price_display && (
              <span className="text-sm font-bold text-gray-400 line-through">
                {apiProduct.price_display}
              </span>
            )}
          </div>
          {apiProduct.formatted_price && (
            <p className="text-xs text-gray-500 mt-1">{apiProduct.formatted_price}</p>
          )}
        </div>

        {/* Availability */}
        <div className="mb-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            apiProduct.availability === 'in_stock' ? 'bg-green-500' :
            apiProduct.availability === 'out_of_stock' ? 'bg-red-500' :
            'bg-yellow-500'
          }`}></div>
          <span className="text-sm font-bold text-gray-700 capitalize">
            {apiProduct.availability.replace('_', ' ')}
          </span>
        </div>

        {/* Add to Cart Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onRemove && onRemove(product.id)}
                  className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-black text-lg hover:bg-red-100 active:scale-95 transition-all"
                >
                  −
                </button>
                <span className="text-lg font-black text-gray-900 min-w-[30px] text-center">{cartQuantity}</span>
                <button
                  onClick={() => onAdd(product)}
                  className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-black text-lg hover:bg-green-100 active:scale-95 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onAdd(product)}
              className="w-full bg-green-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-green-800 active:scale-98 transition-all shadow-lg"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Description */}
        {apiProduct.description_text && (
          <div className="mb-6">
            <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-tight">Description</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {apiProduct.description_text}
            </div>
          </div>
        )}

        {/* Specifications */}
        {apiProduct.specifications && Object.keys(apiProduct.specifications).length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-tight">Specifications</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {Object.entries(apiProduct.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start border-b border-gray-200 pb-2 last:border-0">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-tight flex-1">{key}:</span>
                  <span className="text-xs text-gray-800 text-right flex-1 ml-4">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Images Gallery */}
        {images.length > 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-tight">More Images</h3>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product ID Info */}
        {apiProduct.product_id && (
          <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-200">
            Product ID: {apiProduct.product_id}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

