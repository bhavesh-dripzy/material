import React from 'react';

interface ProductListingHeaderProps {
  title: string;
  onBack: () => void;
  onSearchClick?: () => void;
  onFavoriteClick?: () => void;
}

const ProductListingHeader: React.FC<ProductListingHeaderProps> = ({ 
  title, 
  onBack, 
  onSearchClick,
  onFavoriteClick 
}) => {
  return (
    <div className="bg-white px-4 pt-3 pb-2.5 sticky top-0 z-50 transition-all duration-300 border-b border-gray-100">
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <button onClick={onBack} className="p-1.5 -ml-1.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-900">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-[16px] font-[1000] text-gray-900 uppercase tracking-tight flex-1 text-center">
          {title}
        </h1>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* Favorite/Heart Icon */}
          {onFavoriteClick && (
            <button onClick={onFavoriteClick} className="p-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-900">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          )}
          
          {/* Search Icon */}
          {onSearchClick && (
            <button onClick={onSearchClick} className="p-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-900">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingHeader;

