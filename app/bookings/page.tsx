'use client'

import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';

interface Booking {
  id: string;
  serviceType: 'Carpenters' | 'Plumbers';
  serviceName: string;
  date: string;
  time: string;
  status: 'JOB COMPLETED' | 'BOOKING CANCELLED' | 'PENDING';
  amount?: number;
}

const bookings: Booking[] = [
  {
    id: '1',
    serviceType: 'Carpenters',
    serviceName: 'Living Room Cleaning',
    date: 'Mon, Oct 02, 2023',
    time: '10:00 AM',
    status: 'JOB COMPLETED',
    amount: 190,
  },
  {
    id: '2',
    serviceType: 'Plumbers',
    serviceName: 'Flush Tank Repair',
    date: 'Mon, Oct 02, 2023',
    time: '10:00 AM',
    status: 'BOOKING CANCELLED'
  },
  {
    id: '3',
    serviceType: 'Carpenters',
    serviceName: 'Main Door Repair',
    date: 'Mon, Oct 02, 2023',
    time: '10:00 AM',
    status: 'JOB COMPLETED',
    amount: 150
  }
];

const StatusBadge = ({ status }: { status: Booking['status'] }) => {
  const { isDarkMode } = useTheme();
  
  const getStatusStyle = (status: Booking['status']) => {
    switch (status) {
      case 'JOB COMPLETED':
        return `${isDarkMode ? 'text-blue-400' : 'text-blue-500'} font-normal`;
      case 'BOOKING CANCELLED':
        return `${isDarkMode ? 'text-red-400' : 'text-red-500'} uppercase font-normal`;
      case 'PENDING':
        return `${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} font-normal`;
      default:
        return `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-normal`;
    }
  };

  return (
    <span className={`text-xs font-medium ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

export default function BookingsPage() {
  const { isDarkMode } = useTheme();

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4">
        <h1 className={`text-[22px] font-semibold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>My Bookings</h1>
      </div>

      {/* Bookings List */}
      <div className="px-4">
        {bookings.map((booking, index) => (
          <div key={booking.id} className="mb-6">
            {/* Service Type */}
            <h2 className={`text-[17px] font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              {booking.serviceType}
            </h2>
            
            {/* Booking Card */}
            <Link href={`/bookings/booking-details`}>
              <div className={`flex items-center justify-between ${
                isDarkMode ? 'bg-gray-800' : ''
              } rounded-lg p-4`}>
                <div className="flex-1">
                  {/* Status */}
                  <StatusBadge status={booking.status} />
                  
                  {/* Service Name */}
                  <h3 className={`text-[15px] font-medium mt-1 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {booking.serviceName}
                  </h3>
                  
                  {/* Date & Time */}
                  <p className={`text-[13px] mt-0.5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {booking.date} at {booking.time}
                  </p>
                  
                  {/* Amount & Book Again */}
                  {booking.amount && (
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <span className={`text-[13px] ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>Amount Paid</span>
                        <span className={`text-[13px] ml-1 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>${booking.amount}</span>
                      </div>
                      <button className="ml-auto text-[13px] text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition-colors">
                        Book Again
                      </button>
                    </div>
                  )}
                </div>
                <ChevronRight className={`w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                } ml-2`} />
              </div>
            </Link>

            {/* Divider */}
            {index < bookings.length - 1 && (
              <div className={`border-b mt-4 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}