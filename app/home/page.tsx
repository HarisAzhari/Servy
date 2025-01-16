'use client'

import React, { useState, useEffect } from 'react';
import { MapPin, Search, SlidersHorizontal, Menu, Star } from 'lucide-react';
import Link from 'next/link';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import FilterOverlay from '../../components/navigation/filter';
import { useTheme } from '@/context/ThemeContext';

interface Provider {
  name: string;
  image: string;
  role: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  provider: Provider;
  image: string;
}

const ServiceCard = ({ service }: { service: Service }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4`}>
      <img src={service.image} alt={service.title} className="w-full h-48 object-cover rounded-xl mb-4" />
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          ({service.reviews} Reviews)
        </span>
      </div>
      <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {service.title}
      </h3>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-lg font-bold text-blue-500">${service.price}</span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} line-through`}>
            ${service.originalPrice}
          </span>
        </div>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
          Add
        </button>
      </div>
      <div className="flex items-center">
        <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-full flex items-center justify-center`}>
          <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-medium`}>
            {service.provider.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="ml-2">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {service.provider.name}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {service.provider.role}
          </p>
        </div>
      </div>
    </div>
  );
};

const categories = [
  { icon: "🔨", name: "Carpenter", path: "carpenter" },
  { icon: "🧹", name: "Cleaning", path: "cleaning" },
  { icon: "🎨", name: "Painter", path: "painter" },
  { icon: "⚡", name: "Electrician", path: "electrician" },
  { icon: "💇", name: "Beauty", path: "beauty" },
  { icon: "❄️", name: "AC Repair", path: "ac-repair" },
  { icon: "🔧", name: "Plumber", path: "plumber" },
  { icon: "✂️", name: "Men's Salon", path: "mens-salon" }
];

export default function HomePage() {
  const { isDarkMode } = useTheme();
  const [showFilter, setShowFilter] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/categories/cleaning/services`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <main className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20 relative`}>
      {showFilter && <FilterOverlay onClose={() => setShowFilter(false)} />}
      
      {/* Header */}
      <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <MapPin className="text-blue-500 w-5 h-5 mt-1" />
            <div className="ml-2">
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Delivery Address
              </p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                2118 Thornridge California
              </p>
            </div>
          </div>
          <div className="relative">
            <div className={`w-8 h-8 rounded-full ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            } border shadow-sm flex items-center justify-center`}>
              <Menu className={`w-5 h-5 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
              1
            </div>
          </div>
        </div>

        {/* Search Bar with Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            } w-5 h-5`} />
            <input
              type="text"
              placeholder="Search"
              className={`w-full py-3 pl-12 pr-4 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <button 
            onClick={() => setShowFilter(true)}
            className="p-3 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            All Categories
          </h2>
          <Link href="/category" className="text-blue-500 text-sm font-medium">
            See All
          </Link>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link 
              href={`/category/${category.path}`}
              key={index} 
              className="flex flex-col items-center"
            >
              <div className={`w-14 h-14 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border shadow-sm rounded-xl flex items-center justify-center text-xl mb-2`}>
                {category.icon}
              </div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-center`}>
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Services */}
      <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Best Services
          </h2>
          <button className="text-blue-500 text-sm font-medium">See All</button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4`}>
              <div className={`w-full h-48 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl mb-4 animate-pulse`} />
              <div className="flex items-center mb-2">
                <div className={`w-20 h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded animate-pulse`} />
              </div>
              <div className={`w-3/4 h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded mb-3 animate-pulse`} />
              <div className="flex items-center justify-between mb-3">
                <div className={`w-24 h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded animate-pulse`} />
                <div className={`w-20 h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded animate-pulse`} />
              </div>
              <div className="flex items-center">
                <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full animate-pulse`} />
                <div className="ml-2">
                  <div className={`w-32 h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded mb-1 animate-pulse`} />
                  <div className={`w-24 h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded animate-pulse`} />
                </div>
              </div>
            </div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <ServiceCard 
              service={{
                id: 1,
                title: "Complete Kitchen Cleaning",
                price: 150,
                originalPrice: 180,
                rating: 5,
                reviews: 130,
                description: "",
                provider: {
                  name: "Mark Willions",
                  image: "/api/placeholder/32/32",
                  role: "Service Provider"
                },
                image: "/api/placeholder/400/200"
              }} 
            />
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}