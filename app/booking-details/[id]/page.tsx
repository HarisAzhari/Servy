'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Phone, MessageSquare, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Booking = {
  id: number;
  service_id: number;
  service_title: string;
  service_image: string;
  provider_name: string;
  provider_id: number;
  booking_date: string;
  booking_time: string;
  status: string;
  total_amount: number;
  user_name: string;
  user_mobile: string;
  booking_notes: string | null;
};

type ApiResponse = {
  booking: Booking;
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch (e) {
    return dateStr;
  }
};

const formatTime = (timeStr: string | undefined) => {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return timeStr;
  }
};

const formatAmount = (amount: number | undefined) => {
  return typeof amount === 'number' ? `RM${amount.toFixed(2)}` : 'RM0.00';
};

const getStatusColor = (status: string) => {
  const statusMap: { [key: string]: string } = {
    completed: 'bg-green-500',
    pending: 'bg-yellow-500',
    cancelled: 'bg-red-500',
    default: 'bg-blue-500'
  };
  return statusMap[status.toLowerCase()] || statusMap.default;
};

export default function BookingDetailsPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`http://beerescue.xyz:5000/api/booking/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        const data: ApiResponse = await response.json();
        console.log('Received booking data:', data);
        setBooking(data.booking);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchBookingDetails();
    }
  }, [resolvedParams.id]);

  const handleBookAgain = () => {
    if (booking) {
      router.push(`/service-details/${booking.service_id}`);
    }
  };


  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <Link href="/bookings">
          <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </Link>
        <h1 className={`text-[22px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Booking Details
        </h1>
        <div className="w-6" />
      </div>

      <div className="p-4 space-y-6">
        {/* Service Image and Details */}
        <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="relative w-full h-48">
            {booking?.service_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={booking.service_image}
                alt={booking.service_title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className={`text-[18px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {booking?.service_title}
              </h2>
              <span className={`text-[18px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {formatAmount(booking?.total_amount)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${booking?.status ? getStatusColor(booking.status) : ''}`}>
                {booking?.status?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {formatDate(booking?.booking_date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {formatTime(booking?.booking_time)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your sections... */}

        {/* Book Again Button */}
        <button 
          onClick={handleBookAgain}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-blue-600 transition-colors"
        >
          Book Again
        </button>
      </div>
    </div>
  );
}