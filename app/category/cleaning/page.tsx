// app/category/[categoryName]/page.tsx

'use client'

import React from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Star } from 'lucide-react';
import BottomNavigation from '../../../components/navigation/BottomNavigation';

// Add these interfaces at the top of the file
interface Provider {
    name: string;
    image: string;
  }
  
  interface Service {
    id: number;
    title: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    provider: Provider;
    image: string;
  }

// Sample data - replace with your actual data
const services = [
  {
    id: 1,
    title: "Complete Kitchen Cleaning",
    price: 150,
    originalPrice: 180,
    rating: 5,
    reviews: 150,
    provider: {
      name: "Mark Willions",
      image: "/api/placeholder/40/40"
    },
    image: "/api/placeholder/400/200"
  },
  {
    id: 2,
    title: "Window Cleaning",
    price: 80,
    originalPrice: 100,
    rating: 5,
    reviews: 130,
    provider: {
      name: "Jane Cooper",
      image: "/api/placeholder/40/40"
    },
    image: "/api/placeholder/400/200"
  },
  {
    id: 3,
    title: "Living Room Cleaning",
    price: 200,
    originalPrice: 250,
    rating: 5,
    reviews: 250,
    provider: {
      name: "Ronald Richards",
      image: "/api/placeholder/40/40"
    },
    image: "/api/placeholder/400/200"
  }
];

const ServiceCard = ({ service }: { service: Service }) => {
    return (
      <Link href="/service-details" className="block">
        <div className="bg-white rounded-xl overflow-hidden mb-4 shadow-sm">
          <img 
            src={service.image} 
            alt={service.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-700 ml-2">({service.reviews} Reviews)</span>
            </div>
            <h3 className="font-medium text-lg mb-1 text-gray-900">{service.title}</h3>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={service.provider.image}
                  alt={service.provider.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-700">{service.provider.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-semibold text-gray-900">${service.price}</span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${service.originalPrice}
                </span>
              </div>
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault(); // Prevents the Link navigation when clicking the button
                  // Add your cart logic here
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  };

export default function CategoryServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/category">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold">Best Services</h1>
        </div>
        <button>
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Services List */}
      <div className="p-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}