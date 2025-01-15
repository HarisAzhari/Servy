'use client'

import React from 'react';
import { ChevronLeft, Percent, Lock, User, Clock, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <Link href="/profile" className="text-gray-800">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Notifications</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="p-4">
        {/* Today's Notifications */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Today</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Percent className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">30% Special Discount!</h3>
                <p className="text-sm text-gray-500">Special promotion only valid today</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Password Update Successful</h3>
                <p className="text-sm text-gray-500">Your password update successfully</p>
              </div>
            </div>
          </div>
        </div>

        {/* Yesterday's Notifications */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Yesterday</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Account Setup Successful!</h3>
                <p className="text-sm text-gray-500">Your account has been created</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Get 30% OFF</h3>
                <p className="text-sm text-gray-500">Get 30% OFF on first booking</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Debit card added successfully</h3>
                <p className="text-sm text-gray-500">Your debit card added successfully</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}