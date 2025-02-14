'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Star, Heart } from 'lucide-react';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  service_title: string;
  price: number;
  description: string;
  duration: string;
  provider_name: string;
  provider_photo: string;
  service_image: string;
  service_areas: string[] | string; // Add this line
  category: string;
  custom_category: string;
  category_display: string;
  total_rating: number | null;
  rating_count: number;
  status: boolean;
}

export const ServiceCard = ({ 
    service, 
    onToggleFavorite,
    isFavorite
  }: { 
    service: Service;
    onToggleFavorite: (serviceId: number) => Promise<void>;
    isFavorite: boolean;
  }) => {
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    
    if (!service.status) {
      return null;
    }
  
    const handleToggleFavorite = async (e: React.MouseEvent) => {
      e.preventDefault();
      if (isLoading) return;
      
      setIsLoading(true);
      try {
        await onToggleFavorite(service.id);
      } catch (error) {
        console.error('Error toggling favorite:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Link href={`/service-details/${service.id}/`} className="block relative">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group mb-3`}>
          {/* Image Container with Favorite Button */}
          <div className="relative w-full h-40">
            <img 
              src={service.service_image || '/api/placeholder/400/300'} 
              alt={service.service_title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            {/* Category Badge */}
            <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium
              ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} 
              ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {service.category_display || service.category}
            </div>
            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-2 right-2 z-10 p-1.5 rounded-full 
                ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                transition-all duration-200`}
              disabled={isLoading}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : isDarkMode ? 'text-gray-100' : 'text-gray-600'
                }`}
              />
            </button>
          </div>
  
          {/* Content Container */}
          <div className="p-3">
            {/* Title and Price Row */}
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className={`font-medium text-base leading-tight flex-1 
                ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {service.service_title}
              </h3>
              <div className="flex flex-col items-end">
                <span className="text-base font-bold text-blue-500">
                  RM{service.price}
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {service.duration}
                </span>
              </div>
            </div>
  
            {/* Provider Info */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src={service.provider_photo || '/api/placeholder/32/32'}
                alt={service.provider_name}
                className="w-6 h-6 rounded-full object-cover border border-blue-500"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {service.provider_name}
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${
                        i < (service.total_rating || 0) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className={`ml-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ({service.rating_count})
                  </span>
                </div>
              </div>
            </div>
  
            {/* Service Area */}
            {service.service_areas && (
              <div className="flex gap-1">
                <span className={`text-xs px-2 py-0.5 rounded
                  ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {Array.isArray(service.service_areas) 
                    ? service.service_areas[0] 
                    : service.service_areas.split(',')[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };
export default function BestServicesPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const fetchFavorites = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
  
    try {
      const response = await fetch('http://beerescue.xyz:5000/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });
  
      if (!response.ok) return;
      const data = await response.json();
      setFavorites(new Set(data.services.map((service: Service) => service.id)));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://beerescue.xyz:5000/api/services?status=1');
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();
        // Filter for services with 4+ stars and active status
        const bestServices = data.services.filter((service: Service) => 
          service.status && service.total_rating && service.total_rating >= 4
        ).sort((a: Service, b: Service) => 
          (b.total_rating || 0) - (a.total_rating || 0)
        );
        
        setServices(bestServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (serviceId: number) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://beerescue.xyz:5000/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          service_id: serviceId,
        }),
      });

      if (!response.ok) throw new Error('Failed to toggle favorite');

      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(serviceId)) {
          newFavorites.delete(serviceId);
        } else {
          newFavorites.add(serviceId);
        }
        return newFavorites;
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const LoadingSkeleton = () => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden mb-4 shadow-sm`}>
      <div className="w-full h-48 bg-gray-300 animate-pulse" />
      <div className="p-4">
        <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-3" />
        <div className="flex justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse" />
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
          </div>
          <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-gray-300 rounded animate-pulse mb-3" />
        <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse mb-3" />
        <div className="flex justify-between items-center">
          <div className="h-6 w-16 bg-gray-300 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center gap-4">
          <Link href="/">
            <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
          </Link>
          <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Best Services
          </h1>
        </div>
        <Link href="/search">
          <Search className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
        </Link>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <LoadingSkeleton key={n} />
            ))}
          </div>
        ) : error ? (
          <div className={`text-center py-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
            {error}
          </div>
        ) : services.length > 0 ? (
          services.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.has(service.id)}
            />
          ))
        ) : (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No top-rated services available yet
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}