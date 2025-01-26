'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPhonePage() {
  const router = useRouter();
  
  const handleNext = () => {
    router.push('/enter-otp');
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
  <img 
    src="/image.png" 
    alt="Clean Logo"
    className="w-16 h-16 object-contain"
  />
</div>

      {/* Verification Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Verify Your Email Address</h2>
          <p className="text-lg font-medium mb-2">(219) 555-0114</p>
          <p className="text-gray-600 text-sm">
            We will send the authentication code to your mobile number you entered.
            Do you want continue?
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => router.back()} 
            className="flex-1 py-3 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleNext}
            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}