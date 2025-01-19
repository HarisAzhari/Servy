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
  service_areas: string[] | string;
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

  const checkFavorite = async (userId: string, service: Service): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          service_id: service.id
        }),
      });

      // If we get a 409, it means it's already favorited
      if (response.status === 409) {
        return true;
      }
      
      // If it was successful, we need to remove it since we were just checking
      if (response.ok) {
        await fetch('http://localhost:5000/api/user/favorites', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: parseInt(userId),
            service_id: service.id
          }),
        });
      }

      return false;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

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

      // Check each service if it's favorited
      const favoritesList = [];
      for (const service of data.services) {
        const isFavorited = await checkFavorite(userId, service);
        if (isFavorited) {
          favoritesList.push({ ...service, is_favorite: true });
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
      // In favorites page, we only need to handle removal
      const response = await fetch('http://localhost:5000/api/user/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          service_id: serviceId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      // Update local state after successful removal
      setFavorites(prev => prev.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Failed to remove from favorites. Please try again.');
      setTimeout(() => setError(null), 3000);
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

      {error && (
        <div className={`p-4 mb-4 text-center ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}

      <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <LoadingSkeleton key={n} />
            ))}
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