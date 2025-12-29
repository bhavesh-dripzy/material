import React from 'react';
import { Product } from '../../types';

interface PriceDropSectionProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onRemove?: (productId: string) => void;
  onProductClick?: (productId: string) => void;
  cartItems?: Array<{ id: string; quantity: number }>;
  onViewAll?: () => void;
}

const PriceDropCard = ({ 
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
    <div className="w-[130px] shrink-0 flex flex-col group">
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
        <span className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1 rounded">{product.unit}</span>
      </div>

      <h4 
        className="text-[10px] font-bold text-[#3f200d] leading-tight line-clamp-2 h-6 mb-0.5 uppercase tracking-tighter cursor-pointer hover:text-green-700 transition-colors"
        onClick={() => onProductClick && onProductClick(product.id)}
      >
        {product.name}
      </h4>
      
      {/* Rating */}
      <div className="flex items-center gap-1 mb-0.5">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="6" height="6" viewBox="0 0 24 24" fill={i < Math.floor(product.rating || 0) ? "#f59e0b" : "#e5e7eb"} className="text-yellow-500"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ))}
        </div>
        <span className="text-[7px] font-bold text-gray-400">({product.ratingCount?.toLocaleString()})</span>
      </div>

      {/* Delivery Time */}
      <div className="flex items-center gap-1 mb-0.5">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span className="text-[8px] font-black text-blue-900 uppercase">{product.deliveryTime}</span>
      </div>

      {/* Pricing */}
      <div className="mb-1.5">
        <div className="text-[9px] font-black text-blue-600 uppercase tracking-tighter leading-none">{product.discount}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-[12px] font-[1000] text-gray-900">₹{product.price}</span>
          <span className="text-[8px] font-bold text-gray-400 line-through">MRP ₹{product.originalPrice}</span>
        </div>
      </div>

    </div>
  );
};

const PriceDropSection: React.FC<PriceDropSectionProps> = ({ products, onAdd, onRemove, onProductClick, cartItems = [], onViewAll }) => {
  return (
    <div className="relative bg-[#fdf0e1] -mx-3 px-3 pt-0 pb-6 mb-6 overflow-hidden">
      {/* Background Pattern and Lightning Bolt */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="#3f200d"><circle cx="12" cy="12" r="8"/></svg>
      </div>
      <div className="absolute top-4 right-4 w-28 h-28 text-yellow-400 animate-pulse opacity-80 pointer-events-none">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>

      <div className="relative z-10 pt-6">
        <h2 className="text-[26px] font-[1000] text-[#3f200d] leading-none mb-0.5 tracking-tighter uppercase">Deals of the day</h2>
        <p className="text-[12px] font-bold text-[#3f200d] opacity-70 mb-6 uppercase tracking-tight">Great deals on paints, tools & more</p>
        
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 px-0.5">
          {products.map(product => {
            const cartItem = cartItems.find(item => item.id === product.id);
            const quantity = cartItem?.quantity || 0;
            return (
            <PriceDropCard 
              key={product.id} 
              product={product} 
              onAdd={onAdd}
              onRemove={onRemove}
              onProductClick={onProductClick}
              cartQuantity={quantity}
            />
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="mt-1 bg-white border border-blue-50 rounded-xl p-2.5 flex items-center justify-between shadow-sm">
           <div className="flex -space-x-2">
             <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
               <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
             </div>
             <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
               <img src="https://images.unsplash.com/photo-1510816159960-63fb58b4ddbb?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
             </div>
             <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
               <img src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
             </div>
           </div>
           <button onClick={onViewAll} className="flex items-center gap-1">
             <span className="text-[11px] font-[1000] text-blue-900 uppercase tracking-tighter">See all products</span>
             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="4"><path d="m9 18 6-6-6-6"/></svg>
           </button>
        </div>
      </div>
    </div>
  );
};

export default PriceDropSection;