import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { apiService, ApiProduct } from '../../services/api';
import { mapApiProductsToProducts } from '../../utils/productMapper';

interface ProductListingPageProps {
  products?: Product[];
  onAdd: (product: Product) => void;
  onRemove?: (productId: string) => void;
  cartItems?: Array<{ id: string; quantity: number }>;
  title?: string;
  categoryId?: number;
}

const ProductListingCard = ({ 
  product, 
  onAdd, 
  onRemove,
  onProductClick,
  cartQuantity = 0 
}: { 
  product: Product; 
  onAdd: (p: Product) => void;
  onRemove?: (productId: string) => void;
  onProductClick?: (productId: string) => void;
  cartQuantity?: number;
}) => {
  return (
    <div className="flex flex-col group">
      {/* Image Container */}
      <div 
        className="relative aspect-[4/5] bg-white rounded-xl border border-gray-100/50 shadow-sm overflow-visible mb-2 cursor-pointer"
        onClick={() => onProductClick && onProductClick(product.id)}
      >
        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
        
        {/* Heart Icon */}
        <button className="absolute top-1.5 right-1.5 bg-white/80 p-1 rounded-full backdrop-blur-sm shadow-sm">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>

        {/* Add/Quantity Button Overlay */}
        {cartQuantity > 0 ? (
          <div className="absolute -bottom-2 right-1.5 bg-white border border-green-600 shadow-lg rounded-lg flex items-center gap-1.5 px-2 py-1 z-10">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onRemove) onRemove(product.id);
              }}
              className="w-5 h-5 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-black text-[10px] hover:bg-red-100 active:scale-95 transition-all"
            >
              −
            </button>
            <span className="text-green-700 font-black text-[11px] min-w-[20px] text-center">{cartQuantity}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAdd(product);
              }}
              className="w-5 h-5 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-black text-[10px] hover:bg-green-100 active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        ) : (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="absolute -bottom-2 right-1.5 bg-white border border-green-600 shadow-lg px-3 py-1 rounded-lg text-green-700 font-black text-[10px] hover:bg-green-50 active:scale-95 transition-all z-10"
          >
            ADD
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="flex items-center gap-1 mb-0.5">
        <div className="w-2.5 h-2.5 border border-green-600 flex items-center justify-center p-0.5 rounded-[2px]">
          <div className="w-full h-full bg-green-600 rounded-full"></div>
        </div>
        <span className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1 rounded">{product.unit || 'Unit'}</span>
      </div>

      <h4 
        className="text-[10px] font-bold text-[#3f200d] leading-tight line-clamp-2 h-6 mb-0.5 uppercase tracking-tighter cursor-pointer hover:text-green-700 transition-colors"
        onClick={() => onProductClick && onProductClick(product.id)}
      >
        {product.name}
      </h4>
      
      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-1 mb-0.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="6" height="6" viewBox="0 0 24 24" fill={i < Math.floor(product.rating || 0) ? "#f59e0b" : "#e5e7eb"} className="text-yellow-500"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
          </div>
          {product.ratingCount && (
            <span className="text-[7px] font-bold text-gray-400">({product.ratingCount.toLocaleString()})</span>
          )}
        </div>
      )}

      {/* Delivery Time */}
      {product.deliveryTime && (
        <div className="flex items-center gap-1 mb-0.5">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span className="text-[8px] font-black text-blue-900 uppercase">{product.deliveryTime}</span>
        </div>
      )}

      {/* Pricing */}
      <div className="mb-1.5">
        {product.discount && (
          <div className="text-[9px] font-black text-blue-600 uppercase tracking-tighter leading-none">{product.discount}</div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-[12px] font-[1000] text-gray-900">₹{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[8px] font-bold text-gray-400 line-through">MRP ₹{product.originalPrice}</span>
          )}
        </div>
      </div>

    </div>
  );
};

const ProductListingPage: React.FC<ProductListingPageProps> = ({ 
  products: staticProducts, 
  onAdd,
  onRemove,
  onProductClick,
  cartItems = [],
  title = "All Products",
  categoryId 
}) => {
  const [products, setProducts] = useState<Product[]>(staticProducts || []);
  const [loading, setLoading] = useState(!staticProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (staticProducts) {
      setProducts(staticProducts);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts(categoryId, page, 20);
        if (response.success && response.results) {
          const mappedProducts = mapApiProductsToProducts(response.results);
          if (page === 1) {
            setProducts(mappedProducts);
          } else {
            setProducts(prev => [...prev, ...mappedProducts]);
          }
          setHasMore(response.has_next || false);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, page, staticProducts]);

  if (loading && products.length === 0) {
    return (
      <div className="pb-32">
        <div className="text-center py-12 text-gray-400 text-sm font-bold">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2 overflow-x-auto hide-scrollbar">
        {/* Filter Icon */}
        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-700">
            <circle cx="12" cy="6" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="18" r="2"/>
            <line x1="6" y1="6" x2="10" y2="6" strokeWidth="2"/>
            <line x1="14" y1="6" x2="18" y2="6" strokeWidth="2"/>
            <line x1="6" y1="12" x2="10" y2="12" strokeWidth="2"/>
            <line x1="14" y1="12" x2="18" y2="12" strokeWidth="2"/>
            <line x1="6" y1="18" x2="10" y2="18" strokeWidth="2"/>
            <line x1="14" y1="18" x2="18" y2="18" strokeWidth="2"/>
          </svg>
        </button>
        
        {/* Filter Buttons */}
        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 shrink-0 text-[11px] font-bold text-gray-700">
          Type
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        
        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 shrink-0 text-[11px] font-bold text-gray-700">
          Brand
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
      
      {/* Product Grid */}
      <div className="px-3 py-4">
        <div className="grid grid-cols-2 gap-3">
          {products.map(product => {
            const cartItem = cartItems.find(item => item.id === product.id);
            const quantity = cartItem?.quantity || 0;
            return (
              <ProductListingCard 
                key={product.id} 
                product={product} 
                onAdd={onAdd}
                onRemove={onRemove}
                onProductClick={onProductClick}
                cartQuantity={quantity}
              />
            );
          })}
          {products.length === 0 && !loading && (
            <div className="col-span-2 text-center py-12 text-gray-400 text-sm font-bold">No products found</div>
          )}
        </div>
        
        {/* Load More Button */}
        {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
