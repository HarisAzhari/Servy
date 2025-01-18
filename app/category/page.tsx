'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Hammer, Sparkles, Palette, Zap, Wind, Wrench, Scissors, MoreHorizontal } from 'lucide-react';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';

// Define types
interface ServiceData {
  category: string;
  category_display: string;
}

interface ApiResponse {
  services: ServiceData[];
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/services');
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

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} pb-20`}>
      {/* Header */}
      <div className={`p-4 flex items-center justify-between border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <h1 className={`text-xl font-semibold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>All Categories</h1>
        <div className="flex items-center gap-4">
          <button>
            <Search className={`w-6 h-6 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`} />
          </button>
          <button>
            <ShoppingCart className={`w-6 h-6 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`} />
          </button>
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
          categories.map((category) => (
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
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}