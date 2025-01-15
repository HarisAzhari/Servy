import React from 'react';
import { ChevronLeft, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const BookingDetails = () => {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <Link href="/bookings">
          <ChevronLeft className="w-6 h-6 text-gray-500" />
        </Link>
        <h1 className="text-[22px] font-semibold text-gray-900">Booking Details</h1>
        <div />
      </div>

      <div className="p-4">
        {/* Service Details */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-[18px] font-semibold text-gray-900">{booking.serviceName}</h2>
            <div className="flex items-center">
              <span className="text-[15px] text-gray-500">{booking.rating.toFixed(1)}</span>
              <span className="ml-1 text-yellow-500">★</span>
            </div>
          </div>
          <h3 className="text-[18px] font-semibold text-gray-900">${booking.price}</h3>
        </div>

        <div className="flex space-x-4 mb-4">
          <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md">
            Write a Review
          </button>
          <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md">
            Book Again
          </button>
        </div>

        {/* About Service Provider */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h4 className="text-[15px] font-semibold text-gray-900 mb-2">About Service Provider</h4>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-200 mr-4" />
            <div>
              <h5 className="text-[15px] font-medium text-gray-900">{booking.serviceProvider.name}</h5>
              <div className="flex space-x-2 mt-1">
                {booking.serviceProvider.contact.phone && (
                  <button className="p-2 bg-blue-100 text-blue-500 rounded-full">
                    <Phone className="w-4 h-4" />
                  </button>
                )}
                {booking.serviceProvider.contact.message && (
                  <button className="p-2 bg-blue-100 text-blue-500 rounded-full">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-[15px] font-semibold text-gray-900 mb-2">Booking Status</h4>
          {booking.status.map((step, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'} mr-4`} />
                <h5 className="text-[15px] font-medium text-gray-900">{step.title}</h5>
              </div>
              <p className="text-[13px] text-gray-500 ml-8">{step.description}</p>
              <p className="text-[13px] text-gray-500 ml-8">{step.date} at {step.time}</p>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-[15px] font-semibold text-gray-900 mb-2">Payment Summary</h4>
          <div className="flex justify-between text-[13px] text-gray-500 mb-2">
            <span>Item Total</span>
            <span>${booking.paymentSummary.itemTotal}</span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-500 mb-2">
            <span>Discount</span>
            <span>-${booking.paymentSummary.discount}</span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-500 mb-2">
            <span>Delivery Fee</span>
            <span>{booking.paymentSummary.deliveryFee}</span>
          </div>
          <div className="flex justify-between text-[15px] font-semibold text-gray-900">
            <span>Grand Total</span>
            <span>${booking.paymentSummary.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
