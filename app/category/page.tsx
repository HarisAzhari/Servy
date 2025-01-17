'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';
import { categoryApi, type Category } from '@/lib/api/categories';

export default function CategoriesPage() {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 flex flex-col items-center justify-center`}>
        <p className={`text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} pb-20`}>
      {/* Header */}
      <div className={`p-4 flex items-center justify-between border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      } sticky top-0 z-10`}>
        <h1 className={`text-xl font-semibold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>All Categories</h1>
        <div className="flex items-center gap-4">
          <Link href="/search">
            <Search className={`w-6 h-6 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`} />
          </Link>
          <Link href="/cart">
            <ShoppingCart className={`w-6 h-6 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`} />
          </Link>
        </div>
      </div>

      {/* Categories List */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {categories.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No categories available
          </p>
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