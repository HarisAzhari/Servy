'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft } from 'lucide-react';
import BottomNavigation from '../../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';

interface Service {
  id: number;
  service_title: string;
  price: number;
  description: string;
  duration: string;
  provider_name: string;
  provider_photo: string;
  service_image: string;
  category: string;
  custom_category: string;
  category_display: string;
  customer_requirements: string;
  cancellation_policy: string;
  created_at: string;
  provider_id: number;
  status: boolean;
  total_rating: number | null;  // Add this
  rating_count: number;         // Add this
}

const ServiceCard = ({ service }: { service: Service }) => {
  const { isDarkMode } = useTheme();
  
  if (!service.status) {
    return null;
  }

  const renderRating = (rating: number | null, count: number) => {
    console.log('Rating:', rating, 'Count:', count);

    return (
      <div className="flex items-center gap-1">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Rating: {rating ? `${rating.toFixed(1)}` : 'N/A'}
          {count > 0 ? ` (${count})` : ' (No reviews yet)'}
        </span>
      </div>
    );
  };
  
  return (
    <Link href={`/service-details/${service.id}/`} className="block">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden mb-4 shadow-sm`}>
        <img 
          src={service.service_image || '/api/placeholder/400/300'} 
          alt={service.service_title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className={`font-medium text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {service.service_title}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img
                src={service.provider_photo || '/api/placeholder/100/100'}
                alt={service.provider_name}
                className="w-6 h-6 rounded-full"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {service.provider_name}
              </span>
            </div>
            <div className="flex-shrink-0">
              {renderRating(service.total_rating, service.rating_count)}
            </div>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 line-clamp-2`}>
            {service.description}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Duration: {service.duration}
            </span>
            {service.category_display && service.category_display !== service.category && (
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                • {service.category_display}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-blue-500">${service.price}</span>
            </div>
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add your booking logic here
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};


interface PageProps {
  params: Promise<{ categoryName: string }>;
}

export default function CategoryServicesPage({ params }: PageProps) {
  const { isDarkMode } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    // Resolve the params promise
    Promise.resolve(params).then((resolvedParams) => {
      setCategoryName(resolvedParams.categoryName);
    });
  }, [params]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!categoryName) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `http://localhost:5000/api/services?category=${encodeURIComponent(categoryName)}&status=1`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();
        setServices(data.services);
      } catch (error: unknown) {
        console.error('Error fetching services:', error);
        // Handle the error based on its type
        if (error instanceof Error) {
          setError(`Failed to load services: ${error.message}`);
        } else {
          setError('Failed to load services: An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchServices();
    }
  }, [categoryName]);

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center gap-4">
          <Link href="/category">
            <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
          </Link>
          <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {categoryName && decodeURIComponent(categoryName)}
          </h1>
        </div>
        <Link href="/search">
          <Search className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className={`flex justify-center items-center py-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Loading services...
          </div>
        ) : error ? (
          <div className={`text-center py-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
            {error}
          </div>
        ) : services.length > 0 ? (
          services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No services available in this category yet
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}