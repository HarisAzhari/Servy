'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, MoreVertical, Loader2, Trash2, Edit3, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { addressApi, type Address } from '@/lib/api/address';
import { useTheme } from '@/context/ThemeContext';

interface AddressModalProps {
  onClose: () => void;
  onSubmit: (data: { type: string; address: string; city: string; is_default: boolean }) => void;
  initialData?: Address;
}

const AddressModal = ({ onClose, onSubmit, initialData }: AddressModalProps) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    is_default: initialData?.is_default || false
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <input
                type="text"
                placeholder="Home, Work, etc."
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                placeholder="Street address"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="City"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4 text-blue-500"
              />
              <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                Set as default address
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-500 text-white rounded-lg"
            >
              {initialData ? 'Update' : 'Add'} Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AddressPage() {
  const { user, loading: authLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [showActions, setShowActions] = useState<number | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const data = await addressApi.getAddresses(token);
        setAddresses(data);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchAddresses();
    }
  }, [authLoading, user]);

  const handleAddAddress = async (data: { type: string; address: string; city: string; is_default: boolean }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const newAddress = await addressApi.addAddress(token, data);
      setAddresses(prev => [...prev, newAddress]);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleUpdateAddress = async (data: { type: string; address: string; city: string; is_default: boolean }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !editingAddress) return;

      const updatedAddress = await addressApi.updateAddress(token, editingAddress.id, data);
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? updatedAddress : addr
      ));
      setEditingAddress(undefined);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await addressApi.deleteAddress(token, id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      setShowActions(null);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center justify-between sticky top-0 z-10`}>
        <Link href="/profile">
          <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
        </Link>
        <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Select Address
        </h1>
        <div className="w-6" />
      </div>

      {/* Address List */}
      <div className="p-4">
        {addresses.map((address) => (
          <div 
            key={address.id}
            className={`mb-3 p-4 rounded-xl border ${
              address.is_default 
                ? isDarkMode 
                  ? 'border-blue-500 bg-gray-800' 
                  : 'border-blue-500 bg-blue-50'
                : isDarkMode
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="address"
                  checked={address.is_default}
                  onChange={() => handleUpdateAddress({ ...address, is_default: true })}
                  className="w-4 h-4 text-blue-500"
                />
                <div>
                  <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {address.type}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {address.address}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {address.city}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => setShowActions(address.id)}>
                  <MoreVertical className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </button>
                {showActions === address.id && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } ring-1 ring-black ring-opacity-5 z-20`}>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setEditingAddress(address);
                          setShowModal(true);
                          setShowActions(null);
                        }}
                        className={`flex items-center px-4 py-2 text-sm ${
                          isDarkMode ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                        } w-full`}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add New Address Button */}
        <button 
          onClick={() => {
            setEditingAddress(undefined);
            setShowModal(true);
          }}
          className={`w-full mt-4 flex items-center justify-center gap-2 text-blue-500 py-4 border border-blue-500 rounded-xl ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address Modal */}
      {showModal && (
        <AddressModal
          onClose={() => {
            setShowModal(false);
            setEditingAddress(undefined);
          }}
          onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
          initialData={editingAddress}
        />
      )}
    </main>
  );
}