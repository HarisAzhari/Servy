'use client'

import React, { useState, useEffect } from 'react';
import { MapPin, Search, SlidersHorizontal, Menu, Star } from 'lucide-react';
import Link from 'next/link';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import FilterOverlay from '../../components/navigation/filter';

// Keep interfaces as they are
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
    <div className="bg-card-background rounded-xl shadow-sm p-4">
      <img src={service.image} alt={service.title} className="w-full h-48 object-cover rounded-xl mb-4" />
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-rating-color text-rating-color" />
        ))}
        <span className="ml-2 text-sm text-text-secondary">({service.reviews} Reviews)</span>
      </div>
      <h3 className="font-semibold mb-1 text-text-primary">{service.title}</h3>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-lg font-bold text-price-color">${service.price} </span>
          <span className="text-sm text-text-secondary line-through">${service.originalPrice}</span>
        </div>
        <button className="bg-nav-active text-white px-6 py-2 rounded-lg font-medium hover:bg-nav-active/90 transition-colors">
          Add
        </button>
      </div>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-card-background border border-border-color rounded-full flex items-center justify-center">
          <span className="text-text-primary font-medium">
            {service.provider.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="ml-2">
          <p className="text-sm font-medium text-text-primary">{service.provider.name}</p>
          <p className="text-xs text-text-secondary">{service.provider.role}</p>
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
    <main className="bg-background pb-20 relative">
      {showFilter && <FilterOverlay onClose={() => setShowFilter(false)} />}
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card-background p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <MapPin className="text-nav-active w-5 h-5 mt-1" />
            <div className="ml-2">
              <p className="text-xs text-text-secondary">Delivery Address</p>
              <p className="text-sm font-medium text-text-primary">2118 Thornridge California</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-card-background border border-border-color shadow-sm flex items-center justify-center">
              <Menu className="w-5 h-5 text-text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-nav-active rounded-full text-white text-xs flex items-center justify-center">
              1
            </div>
          </div>
        </div>

        {/* Search Bar with Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              className="w-full py-3 pl-12 pr-4 bg-search-bg rounded-lg text-sm text-search-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-nav-active"
            />
          </div>
          <button 
            onClick={() => setShowFilter(true)}
            className="p-3 bg-nav-active rounded-lg flex items-center justify-center hover:bg-nav-active/90 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">All Categories</h2>
          <Link href="/category" className="text-nav-active text-sm font-medium">See All</Link>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link 
              href={`/category/${category.path}`}
              key={index} 
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 bg-card-background border border-border-color shadow-sm rounded-xl flex items-center justify-center text-xl mb-2">
                {category.icon}
              </div>
              <span className="text-xs text-text-primary text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Services */}
      <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Best Services</h2>
          <button className="text-nav-active text-sm font-medium">See All</button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-card-background rounded-xl shadow-sm p-4">
              <div className="w-full h-48 bg-border-color rounded-xl mb-4 animate-pulse" />
              <div className="flex items-center mb-2">
                <div className="w-20 h-4 bg-border-color rounded animate-pulse" />
              </div>
              <div className="w-3/4 h-6 bg-border-color rounded mb-3 animate-pulse" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-24 h-6 bg-border-color rounded animate-pulse" />
                <div className="w-20 h-8 bg-border-color rounded animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-border-color rounded-full animate-pulse" />
                <div className="ml-2">
                  <div className="w-32 h-4 bg-border-color rounded mb-1 animate-pulse" />
                  <div className="w-24 h-3 bg-border-color rounded animate-pulse" />
                </div>
              </div>
            </div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            // Fallback service card
            <div className="bg-card-background rounded-xl shadow-sm p-4">
              <img src="/api/placeholder/400/200" alt="Kitchen Cleaning" className="w-full h-48 object-cover rounded-xl mb-4" />
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-rating-color text-rating-color" />
                ))}
                <span className="ml-2 text-sm text-text-secondary">(130 Reviews)</span>
              </div>
              <h3 className="font-semibold mb-1 text-text-primary">Complete Kitchen Cleaning</h3>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-price-color">$150 </span>
                  <span className="text-sm text-text-secondary line-through">$180</span>
                </div>
                <button className="bg-nav-active text-white px-6 py-2 rounded-lg font-medium hover:bg-nav-active/90 transition-colors">
                  Add
                </button>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-card-background border border-border-color rounded-full flex items-center justify-center">
                  <span className="text-text-primary font-medium">MW</span>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-text-primary">Mark Willions</p>
                  <p className="text-xs text-text-secondary">Service Provider</p>
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