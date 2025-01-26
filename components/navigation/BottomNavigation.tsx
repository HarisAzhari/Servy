'use client'

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Grid, ClipboardList, User, BookMarked } from 'lucide-react';

const navItems = [
  {
    label: 'Home',
    icon: Home,
    path: '/home'
  },
  {
    label: 'Categories',
    icon: Grid,
    path: '/category'
  },
  {
    label: 'Bookings',
    icon: ClipboardList,
    path: '/bookings'
  },
  {
    label: 'Favourites',
    icon: BookMarked,
    path: '/favourites'
  },
  {
    label: 'Profile',
    icon: User,
    path: '/profile'
  }
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 py-2 px-6">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center"
            >
              <Icon 
                className={`w-6 h-6 ${
                  isActive ? 'text-blue-600' : 'text-blue-300'
                }`}
              />
              <span 
                className={`text-xs mt-1 ${
                  isActive ? 'text-blue-600' : 'text-blue-300'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}