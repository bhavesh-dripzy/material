import React, { useEffect, useState } from 'react';
import { CategoryGroup } from '../../types';
import { apiService, ApiCategory } from '../../services/api';

interface BrowseCategoriesSectionProps {
  groups?: CategoryGroup[];
  onCategoryClick: (catName: string, catId?: number) => void;
}

const BrowseCategoriesSection: React.FC<BrowseCategoriesSectionProps> = ({ groups, onCategoryClick }) => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories from API...');
        const response = await apiService.getCategories();
        console.log('Categories API response:', response);
        if (response.success && response.results) {
          setCategories(response.results);
          console.log('Categories loaded:', response.results.length);
        } else {
          console.error('Failed to fetch categories:', response.error);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Group categories - prioritize API data over static groups
  const groupedCategories: CategoryGroup[] = categories.length > 0 ? [
    {
      title: "All Categories",
      categories: categories.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        image: cat.image_url || 'https://via.placeholder.com/200',
      })),
    },
  ] : (groups || []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12 text-gray-400 text-sm font-bold">Loading categories...</div>
      </div>
    );
  }

  if (groupedCategories.length === 0 || groupedCategories[0].categories.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12 text-gray-400 text-sm font-bold">
          {categories.length === 0 ? 'No categories found. Check API connection.' : 'No categories to display'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedCategories.map((group, groupIdx) => (
        <div key={groupIdx}>
          <h2 className="text-[18px] font-bold text-gray-900 mb-5 leading-none">{group.title}</h2>
          <div className="grid grid-cols-4 gap-x-3 gap-y-6">
            {group.categories.map((cat) => (
              <div 
                key={cat.id} 
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  const apiCat = categories.find(c => c.id.toString() === cat.id);
                  onCategoryClick(cat.name, apiCat?.id);
                }}
              >
                <div className="bg-[#1a4d3e] w-full aspect-square rounded-[18px] flex items-center justify-center overflow-hidden p-2.5 shadow-sm border border-gray-50">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-contain rounded-lg brightness-110 contrast-110" 
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
