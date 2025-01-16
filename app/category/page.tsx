'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart } from 'lucide-react';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';

interface Category {
  id: number;
  name: string;
  path: string;
  icon: string;
  services: string;
}

export default function CategoriesPage() {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className={`p-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Loading...</div>;
  }

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
        {categories.map((category) => (
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
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}