// app/bookings/page.tsx

'use client'

import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import BottomNavigation from '../../components/navigation/BottomNavigation';

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
  const getStatusStyle = (status: Booking['status']) => {
    switch (status) {
      case 'JOB COMPLETED':
        return 'text-blue-500 font-normal';  // Changed to normal weight
      case 'BOOKING CANCELLED':
        return 'text-red-500 uppercase font-normal'; // Changed to normal weight
      case 'PENDING':
        return 'text-yellow-500 font-normal';
      default:
        return 'text-gray-500 font-normal';
    }
  };

  return (
    <span className={`text-xs font-medium ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-[22px] font-semibold text-gray-900">My Bookings</h1>
      </div>

      {/* Bookings List */}
      <div className="px-4">
        {bookings.map((booking, index) => (
          <div key={booking.id} className="mb-6">
            {/* Service Type */}
            <h2 className="text-[17px] font-medium text-gray-900 mb-2">
              {booking.serviceType}
            </h2>
            
            {/* Booking Card */}
            <Link href={`/bookings/booking-details`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Status */}
                  <StatusBadge status={booking.status} />
                  
                  {/* Service Name */}
                  <h3 className="text-[15px] font-medium text-gray-900 mt-1">
                    {booking.serviceName}
                  </h3>
                  
                  {/* Date & Time */}
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    {booking.date} at {booking.time}
                  </p>
                  
                  {/* Amount & Book Again */}
                  {booking.amount && (
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <span className="text-[13px] text-gray-900">Amount Paid</span>
                        <span className="text-[13px] text-gray-900 ml-1">${booking.amount}</span>
                      </div>
                      <button className="ml-auto text-[13px] text-white bg-blue-500 px-3 py-1 rounded-md">
                        Book Again
                      </button>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
              </div>
            </Link>

            {/* Divider */}
            {index < bookings.length - 1 && (
              <div className="border-b border-gray-100 mt-4" />
            )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}