'use client'

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Edit2, Lock, BookOpen, MapPin, Eye, Shield, FileText, LogOut, Home, LayoutGrid, Calendar, MessageSquare, User } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';



export default function ProfilePage() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <main className="min-h-screen bg-white">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">My Profile</h1>

        {/* Profile Image and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
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
          <h2 className="text-lg font-semibold">Smith Johnson</h2>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <Link href="/profile/edit" className="flex items-center justify-between p-3 hover:bg-gray-50">
            <div className="flex items-center">
              <Edit2 className="w-5 h-5 text-gray-600 mr-3" />
              <span>Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/change-password" className="flex items-center justify-between p-3 hover:bg-gray-50">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-gray-600 mr-3" />
              <span>Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/bookings" className="flex items-center justify-between p-3 hover:bg-gray-50">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-gray-600 mr-3" />
              <span>My Bookings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/addresses" className="flex items-center justify-between p-3 hover:bg-gray-50">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-600 mr-3" />
              <span>My Addresses</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <div className="flex items-center justify-between p-3 hover:bg-gray-50">
  <div className="flex items-center">
    <Eye className="w-5 h-5 text-gray-600 mr-3" />
    <span>Dark Mode</span>
  </div>
  <div className="relative inline-flex items-center cursor-pointer">
    <input 
      type="checkbox" 
      checked={isDarkMode}
      onChange={toggleDarkMode}
      className="sr-only peer" 
    />
    <div 
      className={`w-11 h-6 bg-gray-200 rounded-full peer 
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all
        ${isDarkMode ? 'bg-blue-600 after:translate-x-full' : ''}`}
      onClick={toggleDarkMode}
    ></div>
  </div>
</div>


          <Link href="/privacy" className="flex items-center justify-between p-3 hover:bg-gray-50">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-600 mr-3" />
              <span>Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/terms" className="flex items-center justify-between p-3 hover:bg-gray-50">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-600 mr-3" />
              <span>Terms & Conditions</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <button className="flex items-center text-red-500 p-3 w-full hover:bg-gray-50">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-4">
        <Link href="/" className="flex flex-col items-center text-gray-400">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/category" className="flex flex-col items-center text-gray-400">
          <LayoutGrid className="w-6 h-6" />
          <span className="text-xs mt-1">Categories</span>
        </Link>
        <Link href="/bookings" className="flex flex-col items-center text-gray-400">
          <Calendar className="w-6 h-6" />
          <span className="text-xs mt-1">Bookings</span>
        </Link>
        <Link href="/message" className="flex flex-col items-center text-gray-400">
          <MessageSquare className="w-6 h-6" />
          <span className="text-xs mt-1">Message</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-blue-600">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </main>
  );
}