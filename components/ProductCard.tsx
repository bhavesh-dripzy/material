import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, compact }) => {
  return (
    <div className={`${compact ? 'w-28 shrink-0' : 'h-full'} bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm flex flex-col`}>
      <img src={product.image} className={`w-full ${compact ? 'h-20' : 'h-24'} object-cover rounded-lg mb-1.5`} alt={product.name} />
      <h4 className="text-[10px] font-bold text-gray-800 line-clamp-2 h-6 leading-tight mb-0.5 uppercase tracking-tighter">{product.name}</h4>
      <div className="text-[8px] text-gray-400 mb-1.5">{product.unit}</div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[11px] font-black text-gray-900">₹{product.price}</span>
        <button 
          onClick={() => onAdd(product)}
          className="border border-green-600 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-md uppercase active:scale-95 transition-transform"
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default ProductCard;