'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Hammer, Sparkles, Palette, Zap, Wind, Wrench, Scissors, MoreHorizontal, X } from 'lucide-react';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';

// Define types
interface ServiceData {
  category: string;
  category_display: string;
}


interface CategoryCounts {
  [key: string]: number;
}

// Define categories with their icons
const categoryIcons: { [key: string]: React.ReactNode } = {
  'Carpenter': <Hammer className="w-6 h-6 text-blue-500" />,
  'Cleaner': <Sparkles className="w-6 h-6 text-blue-500" />,
  'Painter': <Palette className="w-6 h-6 text-blue-500" />,
  'Electrician': <Zap className="w-6 h-6 text-blue-500" />,
  'AC Repair': <Wind className="w-6 h-6 text-blue-500" />,
  'Plumber': <Wrench className="w-6 h-6 text-blue-500" />,
  "Men's Salon": <Scissors className="w-6 h-6 text-blue-500" />,
  'Other': <MoreHorizontal className="w-6 h-6 text-blue-500" />
};

export default function CategoriesPage() {
  const { isDarkMode } = useTheme();
  const [categoryServices, setCategoryServices] = useState<CategoryCounts>({});
  const [loading, setLoading] = useState(true);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://beerescue.xyz:5000/api/services');
        const data = await response.json();
        
        // Count services by category
        const counts = data.services.reduce((acc: CategoryCounts, service: ServiceData) => {
          const category = service.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        
        setCategoryServices(counts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Create categories array with real-time counts
  const categories = Object.keys(categoryIcons).map((name, index) => ({
    id: index + 1,
    name,
    path: name,
    icon: categoryIcons[name],
    services: `${categoryServices[name] || 0} services available`
  }));

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} pb-20`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h1 className={`text-xl font-semibold transform transition-all duration-300 ${
            showSearchInput ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          } ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            All Categories
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {showSearchInput ? (
                <X className={`w-6 h-6 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`} />
              ) : (
                <Search className={`w-6 h-6 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`} />
              )}
            </button>
            <button className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform ${
              showSearchInput ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'
            }`}>
              <ShoppingCart className={`w-6 h-6 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`} />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className={`overflow-hidden transition-all duration-300 ${
          showSearchInput ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`relative flex items-center transform transition-all duration-300 ${
            showSearchInput ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <Search className={`absolute left-3 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            } w-5 h-5`} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2 pl-10 pr-4 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-100 placeholder-gray-400' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {loading ? (
          // Loading state
          <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading categories...
          </div>
        ) : (
          (searchQuery ? filteredCategories : categories).map((category) => (
            <Link
              href={`/category/${category.path}`}
              key={category.id}
              className={`flex items-center py-4 border-b ${
                isDarkMode 
                  ? 'border-gray-700 hover:bg-gray-800' 
                  : 'border-gray-100 hover:bg-gray-50'
              } last:border-0 transition-colors`}
            >
              <div className={`w-12 h-12 ${
                isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
              } rounded-xl flex items-center justify-center text-2xl mr-4`}>
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>{category.name}</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{category.services}</p>
              </div>
            </Link>
          ))
        )}

        {/* No results message */}
        {searchQuery && filteredCategories.length === 0 && (
          <div className={`text-center py-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            No categories found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}