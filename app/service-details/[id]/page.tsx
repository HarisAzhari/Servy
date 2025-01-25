'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Star, Phone, MessageSquare, Map, Share2, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useSearchParams } from 'next/navigation';

// Define default time slots
const DEFAULT_TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", 
  "05:00 PM", "06:00 PM"
];

interface Service {
  id: number;
  service_title: string;
  price: number;
  description: string;
  duration: string;
  provider_name: string;
  provider_photo: string;
  service_image: string;
  category: string;
  custom_category: string;
  category_display: string;
  customer_requirements: string;
  cancellation_policy: string;
  created_at: string;
  provider_id: number;
  status: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const searchParams = useSearchParams(); // Move here
  const status = searchParams.get('status'); // Move here
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    DEFAULT_TIME_SLOTS.map(time => ({
      time,
      available: true
    }))
  );
  const [bookingError, setBookingError] = useState('');
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  const id = React.use(params).id;

  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Service not found');
        }
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchServiceDetails();
  }, [id]);

  // Fetch time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !service) return;

      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        console.log('Fetching time slots for:', formattedDate);

        const response = await fetch(
          `http://127.0.0.1:5000/api/booking/timeslots?service_id=${service.id}&date=${formattedDate}`
        );

        if (!response.ok) {
          console.log('Error response:', await response.text());
          setTimeSlots(DEFAULT_TIME_SLOTS.map(time => ({
            time,
            available: true
          })));
          return;
        }

        const data = await response.json();
        console.log('Time slots response:', data);

        if (Array.isArray(data.time_slots) && data.time_slots.length > 0) {
          setTimeSlots(data.time_slots);
        } else {
          setTimeSlots(DEFAULT_TIME_SLOTS.map(time => ({
            time,
            available: true
          })));
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setTimeSlots(DEFAULT_TIME_SLOTS.map(time => ({
          time,
          available: true
        })));
      }
    };

    fetchTimeSlots();
  }, [selectedDate, service]);

  const handleCreateBooking = async () => {
    if (isCreatingBooking) return; // Prevent multiple submissions

    try {
      setBookingError('');
      setIsCreatingBooking(true);
  
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        router.push('/login');
        return;
      }
  
      if (!selectedDate || !selectedTime || !service) {
        setBookingError('Please select both date and time');
        setIsCreatingBooking(false); // Reset loading state
        return;
      }
  
      const timeFormatted = convertTo24Hour(selectedTime);
      const dateFormatted = selectedDate.toISOString().split('T')[0];
  
      const bookingData = {
        user_id: parseInt(userId),
        service_id: service.id,
        booking_date: dateFormatted,
        booking_time: timeFormatted
      };
  
      const response = await fetch('http://127.0.0.1:5000/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 409) {
          setBookingError('This time slot is no longer available. Please select a different time.');
          setSelectedTime(""); // Reset selected time
          setIsCreatingBooking(false);
          
          // Refresh time slots
          await refreshTimeSlots();
          return;
        }
        throw new Error(data.error || 'Failed to create booking');
      }
  
      // Successful booking
      setIsBookingModalOpen(false);
      router.push('/bookings');
      
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError(error instanceof Error ? error.message : 'Failed to create booking');
      setSelectedTime(""); // Reset selected time
      await refreshTimeSlots(); // Refresh time slots on error
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // Helper function to refresh time slots
  const refreshTimeSlots = async () => {
    if (!selectedDate || !service) return;
    
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await fetch(
        `http://127.0.0.1:5000/api/booking/timeslots?service_id=${service.id}&date=${formattedDate}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch time slots');
      }
  
      const data = await response.json();
      
      if (Array.isArray(data.time_slots) && data.time_slots.length > 0) {
        setTimeSlots(data.time_slots);
      } else {
        // Reset to default time slots if no data
        setTimeSlots(DEFAULT_TIME_SLOTS.map(time => ({
          time,
          available: true
        })));
      }
    } catch (error) {
      console.error('Error refreshing time slots:', error);
      // Reset to default time slots on error
      setTimeSlots(DEFAULT_TIME_SLOTS.map(time => ({
        time,
        available: true
      })));
    }
  };
  

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    let hoursNum = parseInt(hours, 10);

    if (hoursNum === 12) {
      hoursNum = 0;
    }

    if (modifier === 'PM') {
      hoursNum = hoursNum + 12;
    }

    return `${hoursNum.toString().padStart(2, '0')}:${minutes}`;
  };

  // Add this function near your other state management
const resetBookingStates = () => {
  setSelectedTime("");
  setBookingError("");
  setIsCreatingBooking(false);
};

useEffect(() => {
  if (!isBookingModalOpen) {
    setSelectedTime("");
    setBookingError("");
    setIsCreatingBooking(false);
  }
}, [isBookingModalOpen]);

// Modify the modal open/close handlers
const handleModalOpen = () => {
  resetBookingStates();
  setIsBookingModalOpen(true);
};

const handleModalClose = () => {
  resetBookingStates();
  setIsBookingModalOpen(false);
};

  // Get next 5 weekdays starting from tomorrow
  const getNextWeekdays = () => {
    const weekdays = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow
    
    while (weekdays.length < 5) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday (1) to Friday (5)
        weekdays.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return weekdays;
  };

  if (loading) {
    return (
      <div className={`p-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Loading...
      </div>
    );
  }

  if (!service) {
    return (
      <div className={`p-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Service not found
      </div>
    );
  }

  
  return (
    <>
      <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} pb-24 ${isBookingModalOpen ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center justify-between sticky top-0 z-10`}>
          <Link href={`/category/${service.category}`}>
            <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
          </Link>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Service Details</h1>
          <div className="w-6" />
        </div>

        {/* Service Image */}
        <div className="w-full h-64">
          <img
            src={service.service_image || '/api/placeholder/400/300'}
            alt={service.service_title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Service Info */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
              (0 Reviews)
            </span>
          </div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
            {service.service_title}
          </h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-blue-500">${service.price}</span>
          </div>

          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
              Description
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {service.description}
            </p>
          </div>
        </div>

        {/* Provider Info */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} mt-2 p-4`}>
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>
            About Service Provider
          </h3>
          <div className="flex items-center">
            <img
              src={service.provider_photo || '/api/placeholder/100/100'}
              alt={service.provider_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-3">
              <h4 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {service.provider_name}
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Service Provider
              </p>
            </div>
          </div>
        </div>

        {/* Requirements and Policies */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} mt-2 p-4`}>
          <div className="mb-4">
            <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
              Customer Requirements
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {service.customer_requirements}
            </p>
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
              Cancellation Policy
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {service.cancellation_policy}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
<div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4 flex items-center justify-between`}>
  <div className="flex-1 flex items-center justify-around">
    <button className="flex flex-col items-center">
      <Phone className="w-6 h-6 text-blue-500" />
      <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Call</span>
    </button>
    <button className="flex flex-col items-center">
      <MessageSquare className="w-6 h-6 text-blue-500" />
      <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chat</span>
    </button>
    <button className="flex flex-col items-center">
      <Map className="w-6 h-6 text-blue-500" />
      <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Map</span>
    </button>
    <button className="flex flex-col items-center">
      <Share2 className="w-6 h-6 text-blue-500" />
      <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Share</span>
    </button>
  </div>
  <button 
    onClick={status === 'pending' ? undefined : handleModalOpen}
    disabled={status === 'pending'}
    className={`${
      status === 'pending'
        ? 'bg-yellow-500 opacity-75 cursor-not-allowed'
        : 'bg-blue-500 hover:bg-blue-600'
    } text-white px-8 py-3 rounded-lg ml-4 font-medium transition-colors`}
  >
    {status === 'pending' ? 'Pending' : 'Book Service'}
  </button>
</div>
      </main>

      {/* Booking Modal */}
<div
  className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
    isBookingModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}
  onClick={handleModalClose}  // Changed from setIsBookingModalOpen(false)
/>
<div
  className={`fixed left-0 right-0 bottom-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl transition-transform duration-300 transform ${
    isBookingModalOpen ? 'translate-y-0' : 'translate-y-full'
  }`}
  style={{ maxHeight: '90vh', overflowY: 'auto' }}
  onClick={(e) => e.stopPropagation()}
>
  <div className="p-4">
    <div className="flex justify-between items-center mb-6">
      <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Select Booking Slot
      </h2>
      <button 
  onClick={handleModalClose}  // Changed from setIsBookingModalOpen(false)
  className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
      >
        <X className="w-6 h-6" />
      </button>
    </div>

    {/* Date Selection */}
    <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>
      Select Date
    </h3>
    <div className="flex gap-3 overflow-x-auto py-2">
      {getNextWeekdays().map((date) => {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = date.getDate();
        const isSelected = selectedDate.toDateString() === date.toDateString();
        
        return (
          <div
            key={date.toISOString()}
            onClick={() => {
              setSelectedDate(date);
              setSelectedTime(""); // Reset time when date changes
              setBookingError(""); // Clear any previous errors
            }}
            className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
              ${isSelected 
                ? 'bg-blue-500 text-white' 
                : `${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'} border`
              }`}
          >
            <span className={isSelected ? 'text-white' : `text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {dayName}
            </span>
            <span className={isSelected ? 'text-white font-medium' : `font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {dayNumber}
            </span>
          </div>
        );
      })}
    </div>

    {/* Time Selection */}
    <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mt-6 mb-3`}>
      Select Time
    </h3>
    <div className="grid grid-cols-3 gap-3">
      {timeSlots.map((slot) => {
        const isSelected = selectedTime === slot.time;
        return (
          <div
            key={slot.time}
            onClick={() => slot.available ? setSelectedTime(slot.time) : null}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-colors
              ${isSelected 
                ? 'bg-blue-500 text-white border-blue-500' 
                : slot.available
                  ? `${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            <span className={
              isSelected 
                ? 'text-white' 
                : slot.available 
                  ? `${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`
                  : 'text-gray-400'
            }>
              {slot.time}
            </span>
          </div>
        );
      })}
    </div>

    {/* Error Message */}
    {bookingError && (
      <div className="mt-4 p-3 bg-red-50 rounded-lg">
        <p className="text-red-500 text-sm">{bookingError}</p>
      </div>
    )}

    {/* Confirm Booking Button */}
    <button
      onClick={handleCreateBooking}
      disabled={isCreatingBooking || !selectedDate || !selectedTime}
      className={`w-full bg-blue-500 text-white py-4 rounded-xl font-medium mt-6
        ${(isCreatingBooking || !selectedDate || !selectedTime)
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-blue-600 transition-colors'
        }`}
    >
      {isCreatingBooking ? 'Creating Booking...' : 'Confirm Booking'}
    </button>
  </div>
</div>
</>
);
}