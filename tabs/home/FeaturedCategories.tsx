import React from 'react';

interface CategoryItem {
  id: string;
  title: string;
  image: string;
}

const FEATURED_ITEMS: CategoryItem[] = [
  { id: '1', title: 'Deodorants', image: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=200&auto=format&fit=crop' },
  { id: '2', title: 'Belts & Wallets', image: 'https://images.unsplash.com/photo-1624222247344-550fbad89840?q=80&w=200&auto=format&fit=crop' },
  { id: '3', title: 'Kurtas', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=200&auto=format&fit=crop' },
  { id: '4', title: 'Track Pants', image: 'https://images.unsplash.com/photo-1552664110-ad303e4496e8?q=80&w=200&auto=format&fit=crop' },
  { id: '5', title: 'Sandals', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=200&auto=format&fit=crop' },
  { id: '6', title: 'Handbags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop' },
  { id: '7', title: 'Co-Ords', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop' },
  { id: '8', title: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=200&auto=format&fit=crop' },
  { id: '9', title: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469618-d010d7a221f7?q=80&w=200&auto=format&fit=crop' },
  { id: '10', title: 'Trousers', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=200&auto=format&fit=crop' },
  { id: '11', title: 'Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=200&auto=format&fit=crop' },
  { id: '12', title: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop' },
];

const CategoryCard = ({ item }: { item: CategoryItem }) => (
  <div className="aspect-[4/5] rounded-[20px] bg-gradient-to-b from-[#fff3eb] to-[#f9e9ff] p-2 flex flex-col relative shadow-sm border border-white/60">
    <div className="flex items-center gap-0.5 z-10 mb-1">
      <span className="text-[8px] font-black text-gray-800 leading-none truncate max-w-[80%] uppercase tracking-tighter">{item.title}</span>
      <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" className="text-gray-400"><path d="m9 18 6-6-6-6"/></svg>
    </div>
    <div className="flex-grow flex items-center justify-center overflow-hidden">
      <img 
        src={item.image} 
        alt={item.title} 
        className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply drop-shadow-sm"
      />
    </div>
  </div>
);

const FeaturedCategories: React.FC = () => {
  return (
    <div className="mb-6 px-0.5">
      <div className="grid grid-cols-4 gap-2">
        {FEATURED_ITEMS.map((item) => (
          <CategoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;