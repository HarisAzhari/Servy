'use client'

import React from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function EditProfilePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link href="/profile" className="text-gray-800">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="p-4">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden relative">
              <Image
                src="/api/placeholder/96/96"
                alt="Profile"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full">
              <Home className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-blue-600">Name</label>
            <input
              type="text"
              value="Smith Johnson"
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-blue-600">Email Address</label>
            <input
              type="email"
              value="smithjohnson@example.com"
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-blue-600">Mobile Number</label>
            <input
              type="tel"
              value="(219) 555-0114"
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mt-6 hover:bg-blue-700 transition-colors">
            Update
          </button>
        </form>
      </div>
    </main>
  );
}