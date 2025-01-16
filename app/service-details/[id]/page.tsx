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
        const response = await fetch(`http://localhost:8000/api/services/${id}`)

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
    return <div className="p-4 text-text-primary">Loading...</div>;
  }

  if (!service) {
    return <div className="p-4 text-text-primary">Service not found</div>;
  }

  return (
    <>
      <main className={`min-h-screen bg-background pb-24 ${isBookingModalOpen ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className="bg-card-background p-4 flex items-center justify-between sticky top-0 z-10">
          <Link href={`/category/${service.category.path}`}>
            <ChevronLeft className="w-6 h-6 text-text-primary" />
          </Link>
          <h1 className="text-lg font-semibold text-text-primary">Service Details</h1>
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
        <div className="bg-card-background p-4">
          <div className="flex items-center mb-2">
            {[...Array(service.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-rating-color text-rating-color" />
            ))}
            <span className="text-sm text-text-secondary ml-2">({service.totalReviews} Reviews)</span>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">{service.title}</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-price-color">${service.price}</span>
            <span className="text-lg text-text-secondary line-through">${service.originalPrice}</span>
          </div>

          <div className="border-t border-border-color pt-4">
            <h3 className="font-semibold text-text-primary mb-2">Description</h3>
            <p className="text-text-secondary text-sm">{service.description}</p>
          </div>
        </div>

        {/* Provider Info */}
        <div className="bg-card-background mt-2 p-4">
          <h3 className="font-semibold text-text-primary mb-3">About Service Provider</h3>
          <div className="flex items-center">
            <img
              src={service.provider.image}
              alt={service.provider.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-3">
              <h4 className="font-medium text-text-primary">{service.provider.name}</h4>
              <p className="text-sm text-text-secondary">{service.provider.role}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-card-background mt-2 p-4">
          <h3 className="font-semibold text-text-primary mb-3">Reviews</h3>
          {service.reviews.map((review) => (
            <div key={review.id} className="mb-4 last:mb-0">
              <div className="flex items-center mb-2">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-text-primary">{review.userName}</h4>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-rating-color text-rating-color" />
                    ))}
                    <span className="text-xs text-text-secondary ml-2">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-secondary">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-card-background border-t border-border-color p-4 flex items-center justify-between">
          <div className="flex-1 flex items-center justify-around">
            <button className="flex flex-col items-center">
              <Phone className="w-6 h-6 text-nav-active" />
              <span className="text-xs mt-1 text-text-secondary">Call</span>
            </button>
            <button className="flex flex-col items-center">
              <MessageSquare className="w-6 h-6 text-nav-active" />
              <span className="text-xs mt-1 text-text-secondary">Chat</span>
            </button>
            <button className="flex flex-col items-center">
              <Map className="w-6 h-6 text-nav-active" />
              <span className="text-xs mt-1 text-text-secondary">Map</span>
            </button>
            <button className="flex flex-col items-center">
              <Share2 className="w-6 h-6 text-nav-active" />
              <span className="text-xs mt-1 text-text-secondary">Share</span>
            </button>
          </div>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-nav-active text-white px-8 py-3 rounded-lg ml-4 font-medium"
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
        className={`fixed left-0 right-0 bottom-0 bg-card-background rounded-t-3xl transition-transform duration-300 transform ${
          isBookingModalOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal Content */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Select Booking Slot</h2>
            <button 
              onClick={() => setIsBookingModalOpen(false)}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Date Selection */}
          <h3 className="text-base font-medium text-text-primary mb-3">Select Date</h3>
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
                      ? 'bg-nav-active text-white border-nav-active' 
                      : 'border border-border-color hover:border-nav-active'
                    }`}
                >
                  <span className={`text-sm ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
                    {day}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                    {date}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time Selection */}
          <h3 className="text-base font-medium text-text-primary mt-6 mb-3">Select Time</h3>
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
                      ? 'bg-nav-active text-white border-nav-active' 
                      : 'border-border-color hover:border-nav-active'
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
            <button className="w-full bg-nav-active text-white py-4 rounded-xl font-medium mt-6 hover:bg-nav-active/90 transition-colors">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}