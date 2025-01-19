'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ServiceCard } from '@/category/[categoryName]/page';
import BottomNavigation from '../../components/navigation/BottomNavigation';
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
  total_rating: number | null;
  rating_count: number;
  is_favorite?: boolean;
}

export default function FavoritesPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      // First, fetch all services
      const response = await fetch('http://localhost:5000/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();

      // Then, check each service against favorites endpoint
      const favoritesList = [];
      for (const service of data.services) {
        try {
          // Check if the service is in favorites by trying to add it
          const favoriteResponse = await fetch('http://localhost:5000/api/user/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: parseInt(userId),
              service_id: service.id
            }),
          });

          // If we get a 409 response, it means the service is already in favorites
          if (favoriteResponse.status === 409) {
            favoritesList.push(service);
          }
        } catch (error) {
          // Ignore individual service check errors
        }
      }

      setFavorites(favoritesList);
      setError(null);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (serviceId: number) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      // Since we can't remove favorites with the current API,
      // just update the UI optimistically
      setFavorites(prev => prev.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // If there's an error, refresh the favorites list
      fetchFavorites();
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

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
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center sticky top-0 z-10 shadow-sm`}>
        <Link href="/category" className="mr-4">
          <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
        </Link>
        <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          My Favorites
        </h1>
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
        ) : favorites.length > 0 ? (
          favorites.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={true}
            />
          ))
        ) : (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You haven't added any services to your favorites yet
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}