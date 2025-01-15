'use client'

import React, { useState, useEffect } from 'react';
import { MapPin, Search, SlidersHorizontal, Menu, Star } from 'lucide-react';
import Link from 'next/link';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import FilterOverlay from '../../components/navigation/filter';

// Type definitions
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
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <img src={service.image} alt={service.title} className="w-full h-48 object-cover rounded-xl mb-4" />
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
        ))}
        <span className="ml-2 text-sm text-blue-400">({service.reviews} Reviews)</span>
      </div>
      <h3 className="font-semibold mb-1 text-blue-900">{service.title}</h3>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-lg font-bold text-blue-600">${service.price} </span>
          <span className="text-sm text-blue-300 line-through">${service.originalPrice}</span>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Add
        </button>
      </div>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-medium">
            {service.provider.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="ml-2">
          <p className="text-sm font-medium text-blue-900">{service.provider.name}</p>
          <p className="text-xs text-blue-400">{service.provider.role}</p>
        </div>
      </div>
    </div>
  );
};

// Categories data with proper paths
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
    <main className="bg-blue-50 pb-20 relative">
      {showFilter && <FilterOverlay onClose={() => setShowFilter(false)} />}
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white p-4 space-y-4">
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
          <Link href="/category" className="text-blue-600 text-sm font-medium">See All</Link>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link 
              href={`/category/${category.path}`}
              key={index} 
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-xl mb-2">
                {category.icon}
              </div>
              <span className="text-xs text-blue-900 text-center">{category.name}</span>
            </Link>
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
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 animate-pulse" />
              <div className="flex items-center mb-2">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-3/4 h-6 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="ml-2">
                  <div className="w-32 h-4 bg-gray-200 rounded mb-1 animate-pulse" />
                  <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            // Fallback service card
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
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}