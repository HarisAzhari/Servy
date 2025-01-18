// app/booking/success/page.tsx

'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';

interface BookingDetails {
  service: {
    name: string;
    quantity: number;
  };
  date: {
    day: string;
    date: string;
    time: string;
  };
  address: {
    type: string;
    street: string;
    city: string;
  };
  orderId: string;
}

// Mock booking details (in a real app, this would come from your booking state or API)
const bookingDetails: BookingDetails = {
  service: {
    name: "Living Room Cleaning",
    quantity: 1
  },
  date: {
    day: "Tuesday",
    date: "29 June 2024",
    time: "11:00 AM"
  },
  address: {
    type: "Home",
    street: "4517 Washington Ave.",
    city: "Manchester, Kentucky 39495"
  },
  orderId: "ORD-2024-1234"
};

export default function BookingSuccessPage() {
  const { service, date, address, orderId } = bookingDetails;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Success Icon with animation */}
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle className="w-10 h-10 text-blue-500" />
      </div>

      {/* Success Message */}
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
        Booking Confirm Successfully
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Congratulations 🎉
        <br />
        Your booking has been confirmed
      </p>

      {/* Booking Details */}
      <div className="w-full max-w-sm bg-gray-50 rounded-xl p-4 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h2>
        
        {/* Service */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-900">{service.name}</h3>
          <p className="text-sm text-gray-600">{service.quantity}x Service</p>
        </div>

        {/* Date & Time */}
        <div className="flex items-start gap-4 mb-3">
          <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-gray-900">{date.day}, {date.date}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">{date.time}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4">
          <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-gray-900">{address.type}</p>
            <p className="text-sm text-gray-600">{address.street}</p>
            <p className="text-sm text-gray-600">{address.city}</p>
          </div>
        </div>
      </div>

      {/* Order ID */}
      <p className="text-sm text-gray-500 mb-8">
        Order ID: #{orderId}
      </p>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-3">
        {/* Done Button */}
        <Link href="/" className="block">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-medium transition-colors">
            Done
          </button>
        </Link>

        {/* View Booking Button */}
        <Link href="/bookings" className="block">
          <button className="w-full bg-white border border-blue-500 text-blue-500 py-4 rounded-xl font-medium hover:bg-blue-50 transition-colors">
            View My Bookings
          </button>
        </Link>
      </div>

      {/* Need Help */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">Need help with your booking?</p>
        <Link href="/support" className="text-sm text-blue-500 hover:text-blue-600">
          Contact Support
        </Link>
      </div>
    </main>
  );
}