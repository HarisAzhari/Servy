'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus, CreditCard, Wallet, X } from 'lucide-react';

interface Booking {
  id: number;
  service_title: string;
  provider_name: string;
  booking_date: string;
  booking_time: string;
  total_amount: number;
  status: string;
}

interface PaymentOption {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  icon?: string;
}

const paymentMethods = {
  cards: [
    {
      id: '1',
      type: 'card',
      title: 'Master Card',
      subtitle: '4547 **** **** MG58'
    }
  ],
  other: [
    {
      id: '6',
      type: 'cash',
      title: 'Pay With Cash After Service',
      icon: '/cash.png'
    }
  ]
};

const PaymentMethodItem = ({ title, subtitle, icon }: { title: string, subtitle?: string, icon?: string }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
    <div className="flex items-center gap-3">
      {icon ? (
        <img src={icon} alt={title} className="w-8 h-8 object-contain" />
      ) : (
        <CreditCard className="w-8 h-8 text-gray-500" />
      )}
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </div>
);

const AddCardModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    }
    return cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned.length >= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Add New Card</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="8976 5467 XX87 0098"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ 
                  ...cardDetails, 
                  number: formatCardNumber(e.target.value) 
                })}
                maxLength={19}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Card Holder Name
              </label>
              <input
                type="text"
                placeholder="Smith Johnson"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="12/2026"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ 
                    ...cardDetails, 
                    expiry: formatExpiry(e.target.value) 
                  })}
                  maxLength={7}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ 
                    ...cardDetails, 
                    cvv: e.target.value.replace(/\D/g, '') 
                  })}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium mt-6 hover:bg-blue-600 transition-colors"
            >
              Add Card
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default function PaymentMethodPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handlePaymentMethodClick = async (method: PaymentOption) => {
    if (booking && (method.type === 'card' || method.type === 'cash')) {
      try {
        const response = await fetch(`http://beerescue.xyz:5000/api/booking/${booking.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'paid_deposit',  // Changed from 'paid_deposit' to 'approved'
            payment_method: method.type
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update booking status');
        }
        
        // If successful, navigate to success page
        router.push(`/bookings/success/${booking.id}`);
      } catch (error) {
        console.error('Error updating booking status:', error);
      }
    }
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <main className={`min-h-screen bg-gray-50 ${isAddCardModalOpen ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Payment Method</h1>
          <div className="w-6" />
        </div>

        {/* Payment Amount */}
        <div className="bg-white p-4 mt-2">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Amount to Pay (Deposit)</h2>
          <p className="text-2xl font-semibold text-blue-500">
            RM{(booking.total_amount / 2).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            50% deposit for {booking.service_title}
          </p>
        </div>

        {/* Debit or Credit Card Section */}
        <div className="bg-white mt-2 p-4">
          <h2 className="text-base font-medium text-gray-900 mb-2">Debit or Credit Card</h2>
          {paymentMethods.cards.map(card => (
            <div key={card.id} onClick={() => handlePaymentMethodClick(card)} className="cursor-pointer">
              <PaymentMethodItem 
                title={card.title}
                subtitle={card.subtitle}
              />
            </div>
          ))}
          <button 
            className="w-full mt-4 flex items-center justify-center gap-2 text-blue-500 py-3"
            onClick={() => setIsAddCardModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Add New Card</span>
          </button>
        </div>

        {/* Pay After Service Section */}
        <div className="bg-white mt-2 p-4">
          <h2 className="text-base font-medium text-gray-900 mb-2">Pay After Service</h2>
          {paymentMethods.other.map(method => (
            <div 
              key={method.id} 
              onClick={() => handlePaymentMethodClick(method)}
              className="cursor-pointer"
            >
              <PaymentMethodItem 
                title={method.title}
                icon={method.icon}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Add Card Modal */}
      <AddCardModal 
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
      />
    </>
  );
}