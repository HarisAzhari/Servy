'use client'
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';

// Define the types for API response and request
type Booking = {
  id: number;
  service_id: number;
  service_title: string;
  provider_name: string;
  booking_date: string; // Format: YYYY-MM-DD
  booking_time: string; // Format: HH:MM
  status: string; // e.g., 'pending', 'approved', etc.
  total_amount: number; // e.g., 100.00
};

type ApiResponse = {
  bookings: Booking[];
};

// Utility function to format date
const formatDate = (dateStr: string | number | Date) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

// Utility function to format time
const formatTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Component to display the status badge
const StatusBadge = ({ status }: { status: string }) => {
  const { isDarkMode } = useTheme();

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return `${isDarkMode ? 'text-blue-400' : 'text-blue-500'} font-normal`;
      case 'cancelled':
      case 'rejected':
        return `${isDarkMode ? 'text-red-400' : 'text-red-500'} uppercase font-normal`;
      case 'pending':
        return `${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} font-normal`;
      case 'approved':
        return `${isDarkMode ? 'text-green-400' : 'text-green-500'} font-normal`;
      default:
        return `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-normal`;
    }
  };

  return (
    <span className={`text-xs font-medium ${getStatusStyle(status)}`}>
      {status.toUpperCase()}
    </span>
  );
};

// Main Bookings Page Component
export default function BookingsPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          router.push('/');
          return;
        }

        const response = await fetch(`http://127.0.0.1:5000/api/booking/user/${userId}/bookings`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data: ApiResponse = await response.json();
        setBookings(data.bookings);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 flex items-center justify-center`}
      >
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4">
        <h1 className={`text-[22px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          My Bookings
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Bookings List */}
      <div className="px-4">
        {bookings.length === 0 ? (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No bookings found
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div key={booking.id} className="mb-6">
              {/* Service Name */}
              <h2 className={`text-[17px] font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {booking.service_title}
              </h2>

              {/* Booking Card */}
              <Link href={`/bookings/${booking.id}`}>
                <div
                  className={`flex items-center justify-between ${
                    isDarkMode ? 'bg-gray-800' : ''
                  } rounded-lg p-4`}
                >
                  <div className="flex-1">
                    {/* Status */}
                    <StatusBadge status={booking.status} />

                    {/* Provider Name */}
                    <h3
                      className={`text-[15px] font-medium mt-1 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      {booking.provider_name}
                    </h3>

                    {/* Date & Time */}
                    <p
                      className={`text-[13px] mt-0.5 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {formatDate(booking.booking_date)} at {formatTime(booking.booking_time)}
                    </p>

                    {/* Amount */}
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <span
                          className={`text-[13px] ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
                        >
                          Amount:
                        </span>
                        <span
                          className={`text-[13px] ml-1 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}
                        >
                          ${booking.total_amount}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} ml-2`}
                  />
                </div>
              </Link>

              {/* Divider */}
              {index < bookings.length - 1 && (
                <div
                  className={`border-b mt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}
