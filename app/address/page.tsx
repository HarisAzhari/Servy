// app/address/page.tsx

'use client'

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, MoreVertical } from 'lucide-react';

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  isSelected?: boolean;
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

export default function AddressPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/booking">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Select Address</h1>
        <div className="w-6" />
      </div>

      {/* Address List */}
      <div className="p-4">
        {addresses.map((address) => (
          <div 
            key={address.id}
            className={`mb-3 p-4 rounded-xl border ${
              address.isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="address"
                  checked={address.isSelected}
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
        <button className="w-full mt-4 flex items-center justify-center gap-2 text-blue-500 py-4 border border-blue-500 rounded-xl">
          <Plus className="w-5 h-5" />
          <span>Add New Address</span>
        </button>
      </div>
    </main>
  );
}