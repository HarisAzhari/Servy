'use client'

import React, { useState } from 'react';
import { MapPin, Search, SlidersHorizontal, Menu } from 'lucide-react';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import FilterOverlay from '../../components/navigation/filter';

export default function HomePage() {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <main className="min-h-screen bg-blue-50">
      {showFilter && <FilterOverlay onClose={() => setShowFilter(false)} />}
      
      {/* Header */}
      <div className="p-4 space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <MapPin className="text-blue-600 w-5 h-5 mt-1" />
            <div className="ml-2">
              <p className="text-xs text-blue-400">Delivery Address</p>
              <p className="text-sm font-medium text-blue-900">2118 Thornridge California</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-100 shadow-sm flex items-center justify-center">
              <Menu className="w-5 h-5 text-blue-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">
              1
            </div>
          </div>
        </div>

        {/* Search Bar with Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              className="w-full py-3 pl-12 pr-4 bg-blue-50 rounded-lg text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={() => setShowFilter(true)}
            className="p-3 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-blue-900">All Categories</h2>
          <button className="text-blue-600 text-sm font-medium">See All</button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: "🔨", name: "Carpenter" },
            { icon: "🧹", name: "Cleaner" },
            { icon: "🎨", name: "Painter" },
            { icon: "⚡", name: "Electrician" },
            { icon: "💇", name: "Beauty" },
            { icon: "❄️", name: "AC Repair" },
            { icon: "🔧", name: "Plumber" },
            { icon: "✂️", name: "Men's Salon" },
          ].map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-xl mb-2">
                {category.icon}
              </div>
              <span className="text-xs text-blue-900 text-center">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best Services */}
      <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-blue-900">Best Services</h2>
          <button className="text-blue-600 text-sm font-medium">See All</button>
        </div>

        <div className="space-y-4">
          {/* Service Card */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <img src="/api/placeholder/400/200" alt="Kitchen Cleaning" className="w-full h-48 object-cover rounded-xl mb-4" />
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-blue-500">★</span>
              ))}
              <span className="ml-2 text-sm text-blue-400">(130 Reviews)</span>
            </div>
            <h3 className="font-semibold mb-1 text-blue-900">Complete Kitchen Cleaning</h3>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-lg font-bold text-blue-600">$150 </span>
                <span className="text-sm text-blue-300 line-through">$180</span>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Add
              </button>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">MW</span>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-blue-900">Mark Willions</p>
                <p className="text-xs text-blue-400">Service Provider</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}