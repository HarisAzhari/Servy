'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Star, Phone, MessageSquare, Map, Share2, X } from 'lucide-react';

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  userAvatar: string;
}

interface Service {
  id: number;
  category: {
    name: string;
    path: string;
  };
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  totalReviews: number;
  provider: {
    name: string;
    image: string;
    role: string;
  };
  image: string;
  reviews: Review[];
}

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(29);
  const [selectedTime, setSelectedTime] = useState<string>("11:00 AM");

  const id = React.use(params).id;

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Service not found');
        }
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!service) {
    return <div className="p-4">Service not found</div>;
  }

  return (
    <>
      <main className={`min-h-screen bg-gray-50 pb-24 ${isBookingModalOpen ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
          <Link href={`/category/${service.category.path}`}>
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Service Details</h1>
          <div className="w-6" />
        </div>

        {/* Service Image */}
        <div className="w-full h-64">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Service Info */}
        <div className="bg-white p-4">
          <div className="flex items-center mb-2">
            {[...Array(service.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-700 ml-2">({service.totalReviews} Reviews)</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-900">${service.price}</span>
            <span className="text-lg text-gray-500 line-through">${service.originalPrice}</span>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 text-sm">{service.description}</p>
          </div>
        </div>

        {/* Provider Info */}
        <div className="bg-white mt-2 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">About Service Provider</h3>
          <div className="flex items-center">
            <img
              src={service.provider.image}
              alt={service.provider.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-3">
              <h4 className="font-medium text-gray-900">{service.provider.name}</h4>
              <p className="text-sm text-gray-700">{service.provider.role}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white mt-2 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Reviews</h3>
          {service.reviews.map((review) => (
            <div key={review.id} className="mb-4 last:mb-0">
              <div className="flex items-center mb-2">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">{review.userName}</h4>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-600 ml-2">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between">
          <div className="flex-1 flex items-center justify-around">
            <button className="flex flex-col items-center">
              <Phone className="w-6 h-6 text-blue-500" />
              <span className="text-xs mt-1 text-gray-700">Call</span>
            </button>
            <button className="flex flex-col items-center">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <span className="text-xs mt-1 text-gray-700">Chat</span>
            </button>
            <button className="flex flex-col items-center">
              <Map className="w-6 h-6 text-blue-500" />
              <span className="text-xs mt-1 text-gray-700">Map</span>
            </button>
            <button className="flex flex-col items-center">
              <Share2 className="w-6 h-6 text-blue-500" />
              <span className="text-xs mt-1 text-gray-700">Share</span>
            </button>
          </div>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg ml-4 font-medium"
          >
            Book Service
          </button>
        </div>
      </main>

      {/* Booking Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isBookingModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsBookingModalOpen(false)}
      />
      <div
        className={`fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl transition-transform duration-300 transform ${
          isBookingModalOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal Content */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Select Booking Slot</h2>
            <button 
              onClick={() => setIsBookingModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Date Selection */}
          <h3 className="text-base font-medium text-gray-900 mb-3">Select Date</h3>
          <div className="flex gap-3 overflow-x-auto py-2">
            {["Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
              const date = index + 29;
              const isSelected = selectedDate === date;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
                    ${isSelected 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border border-gray-200 hover:border-blue-200'
                    }`}
                >
                  <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                    {day}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {date}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time Selection */}
          <h3 className="text-base font-medium text-gray-900 mt-6 mb-3">Select Time</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              "10:00 AM",
              "11:00 AM",
              "12:30 PM",
              "01:30 PM",
              "03:00 PM",
              "04:30 PM"
            ].map((time) => {
              const isSelected = selectedTime === time;
              return (
                <div
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-colors
                    ${isSelected 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border-gray-200 hover:border-blue-200'
                    }`}
                >
                  {time}
                </div>
              );
            })}
          </div>

          {/* Proceed Button */}
          <Link 
            href={{
              pathname: '/make-booking',
              query: { 
                serviceId: service.id,
                date: selectedDate,
                time: selectedTime
              }
            }} 
            onClick={() => setIsBookingModalOpen(false)}
          >
            <button className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium mt-6 hover:bg-blue-600 transition-colors">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}