'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function OTPPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl font-semibold">Clean</span>
        </div>
      </div>

      {/* OTP Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Enter OTP</h2>
          <p className="text-gray-600 text-sm">
            A verification code has been sent to (219) 555-0114
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-4 mb-6">
          <input className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg" />
          <input className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg" />
          <input className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg" />
          <input className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg" />
        </div>

        <button 
          onClick={() => router.push('/success')}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
        >
          Verify
        </button>

        <div className="text-center">
          <span className="text-gray-600 text-sm">Didnt receive the code? </span>
          <button className="text-blue-500 text-sm hover:text-blue-600">
            Resend (30s)
          </button>
        </div>
      </div>
    </main>
  );
}