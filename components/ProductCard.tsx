import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onRemove?: (productId: string) => void;
  cartQuantity?: number;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, onRemove, onProductClick, cartQuantity = 0, compact }) => {
  return (
    <div className={`${compact ? 'w-28 shrink-0' : 'h-full'} bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm flex flex-col`}>
      <img 
        src={product.image} 
        className={`w-full ${compact ? 'h-20' : 'h-24'} object-cover rounded-lg mb-1.5 cursor-pointer hover:opacity-90 transition-opacity`} 
        alt={product.name}
        onClick={() => onProductClick && onProductClick(product.id)}
      />
      <h4 
        className="text-[10px] font-bold text-gray-800 line-clamp-2 h-6 leading-tight mb-0.5 uppercase tracking-tighter cursor-pointer hover:text-green-700 transition-colors"
        onClick={() => onProductClick && onProductClick(product.id)}
      >
        {product.name}
      </h4>
      <div className="text-[8px] text-gray-400 mb-1.5">{product.unit}</div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[11px] font-black text-gray-900">₹{product.price}</span>
        {cartQuantity > 0 ? (
          <div className="flex items-center gap-1.5 border border-green-600 rounded-md px-1.5 py-0.5">
            <button 
              onClick={() => onRemove && onRemove(product.id)}
              className="w-4 h-4 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-black text-[8px] hover:bg-red-100 active:scale-95 transition-all"
            >
              −
            </button>
            <span className="text-green-600 font-black text-[9px] min-w-[16px] text-center">{cartQuantity}</span>
            <button 
              onClick={() => onAdd(product)}
              className="w-4 h-4 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-black text-[8px] hover:bg-green-100 active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onAdd(product)}
            className="border border-green-600 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-md uppercase active:scale-95 transition-transform"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;