'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CreateBookingProps {
  serviceId: number; // Assuming serviceId is a number
  serviceName: string; // Assuming serviceName is a string
}

const CreateBooking: React.FC<CreateBookingProps> = ({ serviceId, serviceName }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleBooking = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get user ID from localStorage
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        router.push('/'); // Redirect to login if no user ID
        return;
      }
      
      // Get tomorrow's date as default booking date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const bookingDate = tomorrow.toISOString().split('T')[0];
      
      // Create booking payload
      const bookingData = {
        user_id: parseInt(userId),
        service_id: serviceId,
        booking_date: bookingDate,
        booking_time: "10:00", // Default to 10 AM
        booking_notes: `Booking for ${serviceName}`
      };
      
      // Make API call to create booking
      const response = await fetch('http://beerescue.xyz:5000/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }
      
      const result = await response.json();
      
      // Redirect to bookings page after successful creation
      router.push('/bookings');
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to create booking');
      } else {
        setError('Failed to create booking');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-4">
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}
      <button
        onClick={handleBooking}
        disabled={loading}
        className={`w-full bg-blue-500 text-white py-4 rounded-xl font-medium mt-6 
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 transition-colors'}
        `}
      >
        {loading ? 'Creating Booking...' : 'Make a Booking'}
      </button>
    </div>
  );
};

export default CreateBooking;