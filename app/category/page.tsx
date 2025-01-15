'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart } from 'lucide-react';
import BottomNavigation from '../../components/navigation/BottomNavigation';

interface Category {
  id: number;
  name: string;
  path: string;
  icon: string;
  services: string;
}

export default function CategoriesPage() {
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
    return <div className="p-4">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-semibold text-blue-900">All Categories</h1>
        <div className="flex items-center gap-4">
          <button>
            <Search className="w-6 h-6 text-blue-900" />
          </button>
          <button>
            <ShoppingCart className="w-6 h-6 text-blue-900" />
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="p-4">
        {categories.map((category) => (
          <Link
            href={`/category/${category.path}`}
            key={category.id}
            className="flex items-center py-4 border-b border-gray-100 last:border-0"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mr-4">
              {category.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-blue-900 font-medium">{category.name}</h3>
              <p className="text-sm text-blue-300">{category.services}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}