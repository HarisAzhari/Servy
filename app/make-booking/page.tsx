// app/booking/page.tsx

'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Star, Map, Plus, X, MoreVertical, Minus } from 'lucide-react';

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  isSelected?: boolean;
}

interface Service {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  provider: {
    name: string;
    image: string;
  };
  image: string;
}

const addresses: Address[] = [
  {
    id: '1',
    type: 'Home',
    address: '4517 Washington Ave.',
    city: 'Manchester, Kentucky 39495',
    isSelected: true
  },
  {
    id: '2',
    type: 'Work',
    address: '2118 Thornridge Cir. Syracuse,',
    city: 'Connecticut 35624'
  }
];

const suggestedServices: Service[] = [
  {
    id: 1,
    title: "Complete Kitchen Cleaning",
    price: 150,
    originalPrice: 180,
    rating: 5,
    reviews: 150,
    provider: {
      name: "Mark Willions",
      image: "/api/placeholder/32/32"
    },
    image: "/api/placeholder/200/100"
  },
  {
    id: 2,
    title: "AC Service",
    price: 50,
    originalPrice: 80,
    rating: 5,
    reviews: 120,
    provider: {
      name: "Jacob Jones",
      image: "/api/placeholder/32/32"
    },
    image: "/api/placeholder/200/100"
  }
];

export default function BookingPage() {
  const [quantity, setQuantity] = useState(1);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<number[]>([]);

  // Calculate totals
  const basePrice = 200;
  const baseOriginalPrice = 250;
  const suggestedTotal = selectedSuggestions.reduce((acc, id) => {
    const service = suggestedServices.find(s => s.id === id);
    return acc + (service?.price || 0);
  }, 0);
  const subTotal = (basePrice * quantity) + suggestedTotal;
  const discount = 10;
  const total = subTotal - discount;

  const handleAddSuggestion = (serviceId: number) => {
    if (selectedSuggestions.includes(serviceId)) {
      setSelectedSuggestions(prev => prev.filter(id => id !== serviceId));
    } else {
      setSelectedSuggestions(prev => [...prev, serviceId]);
    }
  };

  return (
    <>
      <main className={`min-h-screen bg-gray-50 pb-20 ${isAddressModalOpen ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
          <Link href="/service-details">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Booking Summary</h1>
          <div className="w-6" />
        </div>

        {/* Selected Service */}
        <div className="bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-700 ml-2">(5.0)</span>
              </div>
              <h2 className="font-medium text-gray-900 mt-1">Living Room Cleaning</h2>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">${basePrice}</span>
                <span className="text-gray-500 line-through ml-2">${baseOriginalPrice}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border rounded-xl p-2">
              <button 
                className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-gray-900 w-8 text-center font-medium">{quantity}</span>
              <button 
                className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Frequently Added Together */}
        <div className="bg-white mt-2 p-4">
          <h3 className="font-medium text-gray-900 mb-3">Frequently Added Together</h3>
          <div className="space-y-4">
            {suggestedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-700 ml-1">({service.reviews} Reviews)</span>
                    </div>
                    <h4 className="font-medium text-gray-900">{service.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">${service.price}</span>
                      <span className="text-sm text-gray-500 line-through">${service.originalPrice}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedSuggestions.includes(service.id)
                      ? 'bg-blue-100 text-blue-500 border border-blue-500'
                      : 'bg-blue-500 text-white'
                  }`}
                  onClick={() => handleAddSuggestion(service.id)}
                >
                  {selectedSuggestions.includes(service.id) ? 'Added' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white mt-2 p-4">
          <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Service (x{quantity})</span>
              <span className="text-gray-900">${basePrice * quantity}</span>
            </div>
            {selectedSuggestions.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Additional Services</span>
                <span className="text-gray-900">${suggestedTotal}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Discount</span>
              <span className="text-green-500">-${discount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Delivery Fee</span>
              <span className="text-green-500">Free</span>
            </div>
            <div className="pt-2 mt-2 border-t flex justify-between items-center font-semibold">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-gray-900">${total}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white mt-2 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Map className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Service Address</h4>
              <p className="text-sm text-gray-700">
                {selectedAddress ? selectedAddress.address : 'Select an address'}
              </p>
            </div>
          </div>
          <button 
            className="text-blue-500 hover:text-blue-600"
            onClick={() => setIsAddressModalOpen(true)}
          >
            Change
          </button>
        </div>

        {/* Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Link href="/payment">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-medium transition-colors">
              Proceed to Payment
            </button>
          </Link>
        </div>
      </main>

      {/* Address Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isAddressModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsAddressModalOpen(false)}
      />
      <div
        className={`fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl transition-transform duration-300 transform ${
          isAddressModalOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Select Address</h2>
            <button 
              onClick={() => setIsAddressModalOpen(false)}
              className="text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Address List */}
          {addresses.map((address) => (
            <div 
              key={address.id}
              className={`mb-3 p-4 rounded-xl border ${
                address.id === selectedAddress.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => {
                setSelectedAddress(address);
                setIsAddressModalOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="address"
                    checked={address.id === selectedAddress.id}
                    className="w-4 h-4 text-blue-500"
                    onChange={() => {}}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{address.type}</h3>
                    <p className="text-sm text-gray-600">{address.address}</p>
                    <p className="text-sm text-gray-600">{address.city}</p>
                  </div>
                </div>
                <button>
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}

          {/* Add New Address Button */}
          <button className="w-full mt-4 flex items-center justify-center gap-2 text-blue-500 py-4 border border-blue-500 rounded-xl hover:bg-blue-50 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add New Address</span>
          </button>
        </div>
      </div>
    </>
  );
}