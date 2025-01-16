'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Star } from 'lucide-react';
import BottomNavigation from '../../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';

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

const ServiceCard = ({ service }: { service: Service }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Link href={`/service-details/${service.id}/`} className="block">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden mb-4 shadow-sm`}>
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center mb-2">
            {[...Array(service.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
              ({service.reviews} Reviews)
            </span>
          </div>
          <h3 className={`font-medium text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {service.title}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img
                src={service.provider.image}
                alt={service.provider.name}
                className="w-6 h-6 rounded-full"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {service.provider.name}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-blue-500">${service.price}</span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} line-through ml-2`}>
                ${service.originalPrice}
              </span>
            </div>
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
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

export default function CategoryServicesPage({ params }: { params: Promise<{ categoryName: string }> }) {
  const { isDarkMode } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryName = React.use(params).categoryName;

  useEffect(() => {
    const fetchServices = async () => {
      if (!categoryName) return;
      
      try {
        const response = await fetch(`http://localhost:8000/api/categories/${categoryName}/services`);
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
  }, [categoryName]);

  if (loading) {
    return <div className={`p-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Loading...</div>;
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center justify-between sticky top-0 z-10`}>
        <div className="flex items-center gap-4">
          <Link href="/category">
            <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
          </Link>
          <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Services for {categoryName}
          </h1>
        </div>
        <button>
          <Search className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
        </button>
      </div>

      {/* Services List */}
      <div className="p-4">
        {services.length > 0 ? (
          services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No services found for this category
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}