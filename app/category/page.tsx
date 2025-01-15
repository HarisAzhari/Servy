// app/category/page.tsx

'use client'

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart } from 'lucide-react';
import BottomNavigation from '../../components/navigation/BottomNavigation';

const categories = [
  { icon: "🔨", name: "Carpenter", path: "carpenter", services: "20 Services" },
  { icon: "🧹", name: "Cleaner", path: "cleaning", services: "14 Services" },  // Changed path to "cleaning"
  { icon: "🎨", name: "Painter", path: "painter", services: "8 Services" },
  { icon: "⚡", name: "Electrician", path: "electrician", services: "15 Services" },
  { icon: "❄️", name: "AC Repair", path: "ac-repair", services: "10 Services" },
  { icon: "🔧", name: "Plumber", path: "plumber", services: "25 Services" },
  { icon: "✂️", name: "Men's Salon", path: "mens-salon", services: "5 Services" },
];

export default function CategoriesPage() {
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
      {categories.map((category, index) => (
  <Link
    href={`/category/${category.path}`}  // Use category.path instead of category.name.toLowerCase()
    key={index}
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