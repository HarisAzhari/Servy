'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';

interface Booking {
  id: number;
  service_title: string;
  provider_name: string;
  booking_date: string;
  booking_time: string;
  total_amount: number;
  status: string;
  user_mobile: string;
}

export default function BookingSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Unwrap params using React.use()
  const { id } = React.use(params);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`http://beerescue.xyz:5000/api/booking/${id}`);
        if (!response.ok) throw new Error('Failed to fetch booking');
        const data = await response.json();
        setBooking(data.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading || !booking) {
    return <div>Loading...</div>;
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
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Success Icon with animation */}
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle className="w-10 h-10 text-blue-500" />
      </div>

      {/* Success Message */}
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
        Deposit Paid Successfully
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Congratulations 🎉
        <br />
        Your booking deposit has been confirmed
      </p>

      {/* Booking Details */}
      <div className="w-full max-w-sm bg-gray-50 rounded-xl p-4 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h2>
        
        {/* Service */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-900">{booking.service_title}</h3>
          <p className="text-sm text-gray-600">By {booking.provider_name}</p>
          <p className="text-sm font-medium text-blue-500 mt-1">
            Deposit Paid: RM{(booking.total_amount / 2).toFixed(2)}
          </p>
        </div>

        {/* Date & Time */}
        <div className="flex items-start gap-4 mb-3">
          <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-gray-900">{formatDate(booking.booking_date)}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">{booking.booking_time}</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-start gap-4">
          <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-gray-900">Contact Number</p>
            <p className="text-sm text-gray-600">{booking.user_mobile}</p>
          </div>
        </div>
      </div>

      {/* Order ID */}
      <p className="text-sm text-gray-500 mb-8">
        Booking ID: #{booking.id}
      </p>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-3">
        <Link href="/home" className="block">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-medium transition-colors">
            Done
          </button>
        </Link>

        <Link href="/bookings" className="block">
          <button className="w-full bg-white border border-blue-500 text-blue-500 py-4 rounded-xl font-medium hover:bg-blue-50 transition-colors">
            View My Bookings
          </button>
        </Link>
      </div>
    </main>
  );
}