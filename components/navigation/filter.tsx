import React from 'react';
import { X, Check } from 'lucide-react';

interface FilterOverlayProps {
  onClose: () => void;
}


const FilterOverlay: React.FC<FilterOverlayProps> = ({ onClose }) => {
  const availabilityOptions: string[] = [
    'Available Now',
    'Available Today',
    'Available This Week'
  ];

  const sortOptions: string[] = [
    'Price: Low to High',
    'Price: High to Low',
    'Rating: High to Low',
    'Most Popular'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-blue-900">Filters</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-blue-50 rounded-full"
            type="button"
          >
            <X className="w-5 h-5 text-blue-900" />
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Price Range</h3>
          <div className="flex gap-3 mb-2">
            <input 
              type="text" 
              placeholder="Min"
              className="w-1/2 p-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Minimum price"
            />
            <input 
              type="text" 
              placeholder="Max"
              className="w-1/2 p-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Maximum price"
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Rating</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 rounded border-blue-300 focus:ring-blue-500"
                  aria-label={`${rating} stars and above`}
                />
                <span className="ml-2 text-sm text-blue-900">
                  {rating} {rating === 1 ? 'Star' : 'Stars'} & above
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Availability</h3>
          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map((time) => (
              <button
                key={time}
                type="button"
                className="px-4 py-2 text-sm border border-blue-200 rounded-full hover:bg-blue-50 text-blue-900"
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Sort By</h3>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input 
                  type="radio" 
                  name="sortBy"
                  className="w-4 h-4 text-blue-600 border-blue-300 focus:ring-blue-500"
                  aria-label={option}
                />
                <span className="ml-2 text-sm text-blue-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-blue-100">
          <button 
            type="button"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterOverlay;