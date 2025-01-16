// app/payment/page.tsx

'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus, CreditCard, Wallet, X } from 'lucide-react';

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
  wallets: [
    {
      id: '2',
      type: 'wallet',
      title: 'Paytm',
      icon: '/paytm.png'
    },
    {
      id: '3',
      type: 'wallet',
      title: 'Amazon Pay',
      icon: '/amazon-pay.png'
    }
  ],
  upi: [
    {
      id: '4',
      type: 'upi',
      title: 'Paytm UPI',
      icon: '/paytm.png'
    },
    {
      id: '5',
      type: 'upi',
      title: 'Google Pay',
      icon: '/gpay.png'
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
  <div className="flex items-center justify-between py-4 border-b border-border-color last:border-b-0">
    <div className="flex items-center gap-3">
      {icon ? (
        <img src={icon} alt={title} className="w-8 h-8 object-contain" />
      ) : (
        <CreditCard className="w-8 h-8 text-text-secondary" />
      )}
      <div>
        <h3 className="font-medium text-text-primary">{title}</h3>
        {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-text-secondary" />
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
    // Add card logic here
    onClose();
  };

  // Format card number with spaces
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

  // Format expiry date
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
        className={`fixed left-0 right-0 bottom-0 bg-card-background rounded-t-3xl transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Add New Card</h2>
            <button 
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="8976 5467 XX87 0098"
                className="w-full p-3 rounded-lg border border-border-color bg-card-background text-text-primary placeholder-text-secondary focus:border-nav-active focus:ring-1 focus:ring-nav-active outline-none"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ 
                  ...cardDetails, 
                  number: formatCardNumber(e.target.value) 
                })}
                maxLength={19}
              />
            </div>

            {/* Card Holder Name */}
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Card Holder Name
              </label>
              <input
                type="text"
                placeholder="Smith Johnson"
                className="w-full p-3 rounded-lg border border-border-color bg-card-background text-text-primary placeholder-text-secondary focus:border-nav-active focus:ring-1 focus:ring-nav-active outline-none"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              />
            </div>

            {/* Expiry Date and CVV */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-text-secondary mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="12/2026"
                  className="w-full p-3 rounded-lg border border-border-color bg-card-background text-text-primary placeholder-text-secondary focus:border-nav-active focus:ring-1 focus:ring-nav-active outline-none"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ 
                    ...cardDetails, 
                    expiry: formatExpiry(e.target.value) 
                  })}
                  maxLength={7}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-text-secondary mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  className="w-full p-3 rounded-lg border border-border-color bg-card-background text-text-primary placeholder-text-secondary focus:border-nav-active focus:ring-1 focus:ring-nav-active outline-none"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ 
                    ...cardDetails, 
                    cvv: e.target.value.replace(/\D/g, '') 
                  })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-nav-active text-white py-4 rounded-xl font-medium mt-6 hover:bg-nav-active/90 transition-colors"
            >
              Add Card
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default function PaymentMethodPage() {
  const router = useRouter();
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  const handlePaymentMethodClick = (method: PaymentOption) => {
    if (method.type === 'card' || method.type === 'cash') {
      router.push('/make-booking/success');
    }
  };

  return (
    <>
      <main className={`min-h-screen bg-background ${isAddCardModalOpen ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className="bg-card-background p-4 flex items-center justify-between sticky top-0 z-10">
          <Link href="/make-booking">
            <ChevronLeft className="w-6 h-6 text-text-primary" />
          </Link>
          <h1 className="text-lg font-semibold text-text-primary">Payment Method</h1>
          <div className="w-6" />
        </div>

        {/* Debit or Credit Card Section */}
        <div className="bg-card-background mt-2 p-4">
          <h2 className="text-base font-medium text-text-primary mb-2">Debit or Credit Card</h2>
          {paymentMethods.cards.map(card => (
            <div key={card.id} onClick={() => handlePaymentMethodClick(card)}>
              <PaymentMethodItem 
                title={card.title}
                subtitle={card.subtitle}
              />
            </div>
          ))}
          <button 
            className="w-full mt-4 flex items-center justify-center gap-2 text-nav-active py-3"
            onClick={() => setIsAddCardModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Add New Card</span>
          </button>
        </div>

        {/* Wallet Section */}
        <div className="bg-card-background mt-2 p-4">
          <h2 className="text-base font-medium text-text-primary mb-2">Wallet</h2>
          {paymentMethods.wallets.map(wallet => (
            <div key={wallet.id} onClick={() => handlePaymentMethodClick(wallet)}>
              <PaymentMethodItem 
                title={wallet.title}
                icon={wallet.icon}
              />
            </div>
          ))}
        </div>

        {/* UPI Section */}
        <div className="bg-card-background mt-2 p-4">
          <h2 className="text-base font-medium text-text-primary mb-2">UPI</h2>
          {paymentMethods.upi.map(upi => (
            <div key={upi.id} onClick={() => handlePaymentMethodClick(upi)}>
              <PaymentMethodItem 
                title={upi.title}
                icon={upi.icon}
              />
            </div>
          ))}
        </div>

        {/* Pay After Service Section */}
        <div className="bg-card-background mt-2 p-4">
          <h2 className="text-base font-medium text-text-primary mb-2">Pay After Service</h2>
          {paymentMethods.other.map(method => (
            <div key={method.id} onClick={() => handlePaymentMethodClick(method)}>
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