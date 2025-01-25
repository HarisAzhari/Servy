'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Menu, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import FilterOverlay from '../../components/navigation/filter';
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
  service_areas: string[] | string; // Add this line
  total_rating: number;
  rating_count: number;
  provider: {
    name: string;
    image: string;
    role: string;
  }
}

interface CategoryCount {
  [key: string]: number;
}

const ServiceCard = ({ service }: { service: Service }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group mb-3`}>
      {/* Image Container */}
      <div className="relative w-full h-40">
        <img 
          src={service.service_image} 
          alt={service.service_title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        {/* Category Badge */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium
          ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} 
          ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {service.category_display || service.category}
        </div>
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
  );
 };

// Define categories mapping
const categoryIcons: { [key: string]: string } = {
  'Carpenter': '🔨',
  'Cleaner': '🧹',
  'Painter': '🎨',
  'Electrician': '⚡',
  'Beauty': '💇',
  'AC Repair': '❄️',
  'Plumber': '🔧',
  "Men's Salon": '✂️'
};

export default function HomePage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [categories, setCategories] = useState<CategoryCount>({});


  useEffect(() => {
    // Get user name from localStorage
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const fetchServices = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();

        // Sort services by rating and take top rated ones
        const sortedServices = data.services
          .filter((service: Service) => service.total_rating != null)
          .sort((a: Service, b: Service) => (b.total_rating || 0) - (a.total_rating || 0))
          .slice(0, 5); // Take top 5 rated services

        setServices(sortedServices);
        setFilteredServices(sortedServices); // Initialize filtered services with all services

        // Count services by category
        const categoryCounts = data.services.reduce((acc: CategoryCount, service: any) => {
          const category = service.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        
        setCategories(categoryCounts);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

   // Add search functionality
   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = services.filter(service => {
      return (
        service.service_title.toLowerCase().includes(query) ||
        service.provider_name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        (service.custom_category && service.custom_category.toLowerCase().includes(query))
      );
    });
    
    setFilteredServices(filtered);
  };

  const categoryEntries = Object.entries(categoryIcons).map(([name, icon]) => ({
    name,
    icon,
    count: categories[name] || 0,
    path: name.toLowerCase().replace("'s", 's').replace(' ', '-')
  }));

  return (
    <main className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20 relative`}>
      {showFilter && <FilterOverlay onClose={() => setShowFilter(false)} />}
      
      {/* Header */}
      <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="ml-2">
              <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Hello, {userName || 'Guest'}
              </h1>
            </div>
          </div>
          <div className="relative">
            <Link href="/profile">
              <div className={`w-8 h-8 rounded-full ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              } border shadow-sm flex items-center justify-center`}>
                <Menu className={`w-5 h-5 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
              </div>
            </Link>
          </div>
        </div>

         {/* Updated Search Bar with Filter */}
         <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            } w-5 h-5`} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
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
          <Link href="/services" className="text-blue-500 text-sm font-medium">
            See All
          </Link>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {categoryEntries.map((category, index) => (
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

       {/* Updated Best Services section */}
       <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Best Services
          </h2>
          <Link href="" className="text-blue-500 text-sm font-medium">
            See All
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            // Loading skeletons here...
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 animate-pulse`}>
                  <div className="w-full h-48 bg-gray-300 rounded-xl mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No services found matching your search
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}