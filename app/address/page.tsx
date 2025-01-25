'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, Home, Building2, Pencil, Trash2, ChevronLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  landmark?: string;
  isDefault: boolean;
}

export default function AddressPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: 'home',
    name: '',
    address: '',
    landmark: '',
    isDefault: false
  });

  useEffect(() => {
    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem('user_addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      // Set demo data if no addresses exist
      const demoAddresses: Address[] = [
        {
          id: '1',
          type: 'home',
          name: 'Home',
          address: 'Jalan Taman Melati 2/1, Taman Melati, 53100 Kuala Lumpur',
          landmark: 'Near Taman Melati LRT Station',
          isDefault: true
        },
        {
          id: '2',
          type: 'work',
          name: 'Office',
          address: 'Menara KLCC, Jalan Ampang, 50088 Kuala Lumpur',
          landmark: 'Near KLCC LRT Station',
          isDefault: false
        }
      ];
      setAddresses(demoAddresses);
      localStorage.setItem('user_addresses', JSON.stringify(demoAddresses));
    }
  }, []);

  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
    localStorage.setItem('user_addresses', JSON.stringify(newAddresses));
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      type: 'home',
      name: '',
      address: '',
      landmark: '',
      isDefault: false
    });
    setIsAddDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsAddDialogOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    const newAddresses = addresses.filter(addr => addr.id !== id);
    saveAddresses(newAddresses);
  };

  const handleSetDefault = (id: string) => {
    const newAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(newAddresses);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      // Update existing address
      const newAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? { ...formData, id: editingAddress.id } : addr
      );
      saveAddresses(newAddresses);
    } else {
      // Add new address
      const newAddress = {
        ...formData,
        id: Date.now().toString()
      };
      const newAddresses = formData.isDefault 
        ? [...addresses.map(addr => ({ ...addr, isDefault: false })), newAddress]
        : [...addresses, newAddress];
      saveAddresses(newAddresses);
    }
    setIsAddDialogOpen(false);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'work':
        return <Building2 className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} pb-20`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className={`mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            My Addresses
          </h1>
        </div>

        {/* Add Address Button */}
        <button
          onClick={handleAddAddress}
          className={`w-full p-4 mb-6 rounded-lg border-2 border-dashed flex items-center justify-center gap-2
            ${isDarkMode 
              ? 'border-gray-700 text-gray-300 hover:border-gray-600' 
              : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
        >
          <Plus className="w-5 h-5" />
          <span>Add New Address</span>
        </button>

        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-750' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    {getAddressIcon(address.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        {address.name}
                      </h3>
                      {address.isDefault && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                          Default
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {address.address}
                    </p>
                    {address.landmark && (
                      <p className={`text-sm mt-1 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        Landmark: {address.landmark}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className={`p-2 rounded-lg ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="mt-3 text-sm text-blue-500 hover:text-blue-600"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-gray-100' : ''}>
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Address Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'home' | 'work' | 'other' })}
                className={`w-full p-2 rounded-md ${
                  isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white'
                }`}
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Address Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Home, Office, etc."
                className={isDarkMode ? 'bg-gray-700 text-gray-100' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your full address"
                className={isDarkMode ? 'bg-gray-700 text-gray-100' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="Enter a nearby landmark"
                className={isDarkMode ? 'bg-gray-700 text-gray-100' : ''}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              />
              <Label htmlFor="isDefault">Set as default address</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAddress ? 'Update' : 'Add'} Address
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}