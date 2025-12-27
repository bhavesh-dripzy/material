import React from 'react';
import { CategoryGroup } from '../../types';

interface BrowseCategoriesSectionProps {
  groups: CategoryGroup[];
  onCategoryClick: (catName: string) => void;
}

const BrowseCategoriesSection: React.FC<BrowseCategoriesSectionProps> = ({ groups, onCategoryClick }) => {
  return (
    <div className="space-y-8">
      {groups.map((group, groupIdx) => (
        <div key={groupIdx}>
          <h2 className="text-[18px] font-bold text-gray-900 mb-5 leading-none">{group.title}</h2>
          <div className="grid grid-cols-4 gap-x-3 gap-y-6">
            {group.categories.map((cat) => (
              <div 
                key={cat.id} 
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                onClick={() => onCategoryClick(cat.name)}
              >
                <div className="bg-[#f0f9f8] w-full aspect-square rounded-[18px] flex items-center justify-center overflow-hidden p-2.5 shadow-sm border border-gray-50">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-contain mix-blend-multiply rounded-lg" 
                  />
                </div>
                <span className="text-[10px] font-semibold text-gray-900 text-center mt-2 leading-tight h-8 flex items-start justify-center px-1">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrowseCategoriesSection;