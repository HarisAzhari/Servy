'use client';

import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NotFound() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <Link href="/bookings">
          <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </Link>
        <h1 className={`text-[22px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Not Found
        </h1>
        <div className="w-6" />
      </div>
      
      <div className="p-4 text-center">
        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Booking Not Found
        </h2>
        <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          The booking you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/bookings" 
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Bookings
        </Link>
      </div>
    </div>
  );
}