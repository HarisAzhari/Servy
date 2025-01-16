'use client'

import React from 'react';
import { ChevronLeft, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const BookingDetails = () => {
  const { isDarkMode } = useTheme();
  
  const booking = {
    id: '1',
    serviceName: 'Living Room Cleaning',
    price: 190,
    rating: 5.0,
    serviceProvider: {
      name: 'Ronald Richards',
      contact: {
        phone: true,
        message: true,
      },
    },
    status: [
      {
        title: 'Booking Confirmed',
        description: 'Service provider has accepted your booking',
        date: 'Mon, Oct 02, 2023',
        time: '10:00 AM',
      },
      {
        title: 'Vendor Out for Service',
        description: 'Service provider is reaching your location',
        date: 'Mon, Oct 02, 2023',
        time: '09:00 AM',
      },
      {
        title: 'Service Completed',
        description: 'Service provider has completed the service',
        date: 'Tue, Oct 03, 2023',
        time: '12:00 AM',
      },
    ],
    paymentSummary: {
      itemTotal: 200,
      discount: 10,
      deliveryFee: 'Free',
      grandTotal: 190,
    },
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
        <div />
      </div>

      <div className="p-4">
        {/* Service Details */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className={`text-[18px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {booking.serviceName}
            </h2>
            <div className="flex items-center">
              <span className={`text-[15px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {booking.rating.toFixed(1)}
              </span>
              <span className="ml-1 text-yellow-500">★</span>
            </div>
          </div>
          <h3 className={`text-[18px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            ${booking.price}
          </h3>
        </div>

        <div className="flex space-x-4 mb-4">
          <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Write a Review
          </button>
          <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Book Again
          </button>
        </div>

        {/* About Service Provider */}
        <div className={`border-t pt-4 mb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-[15px] font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            About Service Provider
          </h4>
          <div className="flex items-center">
            <div className={`h-10 w-10 rounded-full mr-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div>
              <h5 className={`text-[15px] font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {booking.serviceProvider.name}
              </h5>
              <div className="flex space-x-2 mt-1">
                {booking.serviceProvider.contact.phone && (
                  <button className={`p-2 rounded-full ${
                    isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-500'
                  }`}>
                    <Phone className="w-4 h-4" />
                  </button>
                )}
                {booking.serviceProvider.contact.message && (
                  <button className={`p-2 rounded-full ${
                    isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-500'
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status */}
        <div className={`border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-[15px] font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Booking Status
          </h4>
          {booking.status.map((step, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-full mr-4 ${
                  index === 0 
                    ? 'bg-blue-500' 
                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`} />
                <h5 className={`text-[15px] font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {step.title}
                </h5>
              </div>
              <p className={`text-[13px] ml-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {step.description}
              </p>
              <p className={`text-[13px] ml-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {step.date} at {step.time}
              </p>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className={`border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-[15px] font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Payment Summary
          </h4>
          <div className={`flex justify-between text-[13px] mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>Item Total</span>
            <span>${booking.paymentSummary.itemTotal}</span>
          </div>
          <div className={`flex justify-between text-[13px] mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>Discount</span>
            <span>-${booking.paymentSummary.discount}</span>
          </div>
          <div className={`flex justify-between text-[13px] mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>Delivery Fee</span>
            <span>{booking.paymentSummary.deliveryFee}</span>
          </div>
          <div className={`flex justify-between text-[15px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            <span>Grand Total</span>
            <span>${booking.paymentSummary.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;