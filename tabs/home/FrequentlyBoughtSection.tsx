import React from 'react';
import { Product } from '../../types';
import ProductCard from '../../components/ProductCard';

interface FrequentlyBoughtSectionProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onRemove?: (productId: string) => void;
  onProductClick?: (productId: string) => void;
  cartItems?: Array<{ id: string; quantity: number }>;
}

const FrequentlyBoughtSection: React.FC<FrequentlyBoughtSectionProps> = ({ products, onAdd, onRemove, onProductClick, cartItems = [] }) => {
  return (
    <div>
      <h3 className="text-[14px] font-black text-gray-900 mb-3 uppercase tracking-tighter">Frequently bought</h3>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
        {products.map(product => {
          const cartItem = cartItems.find(item => item.id === product.id);
          const quantity = cartItem?.quantity || 0;
          return (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={onAdd}
              onRemove={onRemove}
              onProductClick={onProductClick}
              cartQuantity={quantity}
              compact 
            />
          );
        })}
      </div>
    </div>
  );
};

export default FrequentlyBoughtSection;