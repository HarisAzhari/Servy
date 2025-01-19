'use client'

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

interface Booking {
  id: number;
  service_id: number;
  service_title: string;
  provider_name: string;
  booking_date: string;
  booking_time: string;
  status: string;
  total_amount: number;
  booking_notes: string;
  service_image: string;
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Unwrap params using React.use()
  const { id } = React.use(params);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/booking/${id}`);
        if (!response.ok) throw new Error('Failed to fetch booking');
        const data = await response.json();
        
        // Access the booking object inside the response
        setBooking(data.booking); // Changed from setBooking(data) to setBooking(data.booking)
        
      } catch (err) {
        setError('Failed to load booking details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 flex items-center justify-center`}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Checkout
          </h1>
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-4 space-y-6">
        {/* Service Info */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
              {booking.service_image ? (
                <img
                  src={booking.service_image}
                  alt={booking.service_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
            </div>
            <div>
              <h2 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {booking.service_title}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                By {booking.provider_name}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm space-y-4`}>
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Booking Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {formatDate(booking.booking_date)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {booking.booking_time}
              </span>
            </div>
          </div>

          {booking.booking_notes && (
            <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>Notes:</strong> {booking.booking_notes}
              </p>
            </div>
          )}
        </div>

       {/* Price Summary */}
<div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
  <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
    Price Summary
  </h3>
  
  <div className="space-y-2">
    <div className="flex justify-between">
      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Service Price</span>
      <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>RM{booking.total_amount.toFixed(2)}</span>
    </div>

    <div className="flex justify-between">
      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Deposit (50%)</span>
      <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>RM{(booking.total_amount / 2).toFixed(2)}</span>
    </div>
    
    <div className="pt-2 mt-2 border-t border-gray-200">
      <div className="flex justify-between font-medium">
        <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Total Amount (Deposit)</span>
        <span className="text-blue-500">RM{(booking.total_amount / 2).toFixed(2)}</span>
      </div>
    </div>
  </div>
</div>
        {/* Proceed to Payment Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => router.push(`/payment/${booking.id}`)}
            className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-600 transition-colors"
          >
            Proceed to Deposit
          </button>
        </div>

        {/* Add padding at the bottom to account for fixed button */}
        <div className="h-24"></div>
      </div>
    </main>
  );
}