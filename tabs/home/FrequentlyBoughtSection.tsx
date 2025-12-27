import React from 'react';
import { Product } from '../../types';
import ProductCard from '../../components/ProductCard';

interface FrequentlyBoughtSectionProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

const FrequentlyBoughtSection: React.FC<FrequentlyBoughtSectionProps> = ({ products, onAdd }) => {
  return (
    <div>
      <h3 className="text-[14px] font-black text-gray-900 mb-3 uppercase tracking-tighter">Frequently bought</h3>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} compact />
        ))}
      </div>
    </div>
  );
};

export default FrequentlyBoughtSection;