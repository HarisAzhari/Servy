'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Edit2, Lock, BookOpen, MapPin, Eye, Shield, FileText, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import BottomNavigation from '../../components/navigation/BottomNavigation';

export default function ProfilePage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  interface User {
    id: string;
    name: string | null;
    email: string | null;
    mobile: string | null;
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('user_email');
    const userMobile = localStorage.getItem('user_mobile');

    if (!userId) {
      router.push('/'); // Redirect to login if no user data
      return;
    }

    setUser({
      id: userId,
      name: userName,
      email: userEmail,
      mobile: userMobile
    });
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_mobile');
    
    // Redirect to login page
    router.push('/');
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 flex items-center justify-center`}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} pb-20`}>
      <div className="p-4">
        <h1 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          My Profile
        </h1>

        {/* Profile Image and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden relative">
              <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <span className="text-2xl font-semibold">{user?.name?.charAt(0)}</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {user?.name}
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {user?.email}
          </p>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <Link 
            href="/profile/edit" 
            className={`flex items-center justify-between p-3 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Edit2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Edit Profile</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </Link>

          <Link 
            href="/change-password" 
            className={`flex items-center justify-between p-3 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Lock className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Change Password</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </Link>

          <Link 
            href="/bookings" 
            className={`flex items-center justify-between p-3 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>My Bookings</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </Link>

          <Link 
            href="/address" 
            className={`flex items-center justify-between p-3 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>My Addresses</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </Link>

          <div className={`flex items-center justify-between p-3 ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
          }`}>
            <div className="flex items-center">
              <Eye className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Dark Mode</span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isDarkMode}
                onChange={toggleDarkMode}
                className="sr-only peer" 
              />
              <div 
                className={`w-11 h-6 ${isDarkMode ? 'bg-blue-500' : 'bg-gray-200'} rounded-full peer 
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                  after:bg-white after:border-gray-300 after:border after:rounded-full 
                  after:h-5 after:w-5 after:transition-all
                  ${isDarkMode ? 'after:translate-x-full' : ''}`}
                onClick={toggleDarkMode}
              ></div>
            </div>
          </div>

          <Link 
            href="/privacy" 
            className={`flex items-center justify-between p-3 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Shield className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Privacy Policy</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </Link>

          <Link 
            href="/terms" 
            className={`flex items-center justify-between p-3 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <FileText className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Terms & Conditions</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </Link>

          <button 
            onClick={handleLogout}
            className={`flex items-center text-red-500 p-3 w-full ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}