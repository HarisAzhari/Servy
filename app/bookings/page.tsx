'use client'
import React, { useState, useEffect } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';

type RatingModalProps = {
  booking: Booking;
  onClose: () => void;
  onSubmitRating: (bookingId: number) => void;
};

type RatingStats = {
  distribution: { [key: number]: number };
  distribution_percentage: { [key: number]: number };
  total_reviews: number;
};

// Define the types for API response and request
type Booking = {
  id: number;
  service_id: number;
  service_title: string;
  provider_name: string;
  booking_date: string; // Format: YYYY-MM-DD
  booking_time: string; // Format: HH:MM
  status: string; // e.g., 'pending', 'approved', etc.
  total_amount: number; // e.g., 100.00
};

type ApiResponse = {
  bookings: Booking[];
};

// Utility function to format date
const formatDate = (dateStr: string | number | Date) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

// Utility function to format time
const formatTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Rating Modal Component
const RatingModal = ({ booking, onClose, onSubmitRating }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const { isDarkMode } = useTheme();

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/service/${booking.service_id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_id'),
          rating: rating,
          review_text: reviewText,
          booking_id: booking.id
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      onSubmitRating(booking.id);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Rate {booking.service_title}
        </h2>
        
        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              <Star className="w-8 h-8" fill={star <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>

        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience (optional)"
          className={`w-full p-3 rounded-lg mb-4 ${
            isDarkMode 
              ? 'bg-gray-700 text-white placeholder-gray-400' 
              : 'bg-gray-50 text-gray-900 placeholder-gray-500'
          }`}
          rows={4}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`px-4 py-2 rounded-lg bg-blue-500 text-white ${
              rating === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

// Component to display the status badge
const StatusBadge = ({ status }: { status: string }) => {
  const { isDarkMode } = useTheme();

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return `${isDarkMode ? 'text-blue-400' : 'text-blue-500'} font-normal`;
      case 'cancelled':
        return `${isDarkMode ? 'text-red-400' : 'text-red-500'} font-normal`;
      case 'rejected':
        return `${isDarkMode ? 'text-red-400' : 'text-red-500'} uppercase font-normal`;
      case 'pending':
        return `${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} font-normal`;
      case 'approved':
        return `${isDarkMode ? 'text-green-400' : 'text-green-500'} font-normal`;
      case 'paid_deposit':
        return `${isDarkMode ? 'text-green-400' : 'text-green-500'} font-normal`;
      default:
        return `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-normal`;
    }
  };

  return (
    <span className={`text-xs font-medium ${getStatusStyle(status)}`}>
      {status.toUpperCase()}
    </span>
  );
};

const ServiceRating = ({ serviceId }: { serviceId: number }) => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState<RatingStats | null>(null);

  useEffect(() => {
    const fetchRatingStats = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/service/${serviceId}/rating-stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching rating stats:', error);
      }
    };

    fetchRatingStats();
  }, [serviceId]);

  if (!stats) return null;

  // Calculate average rating
  const totalRating = Object.entries(stats.distribution).reduce(
    (sum, [rating, count]) => sum + (Number(rating) * count), 
    0
  );
  const averageRating = stats.total_reviews > 0 
    ? (totalRating / stats.total_reviews).toFixed(1) 
    : '0.0';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
        <span className={`text-[13px] ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
          {averageRating}
        </span>
      </div>
      <span className={`text-[13px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        ({stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
};

// Main Bookings Page Component
export default function BookingsPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unratedBookings, setUnratedBookings] = useState<Booking[]>([]);
  const [currentRatingBooking, setCurrentRatingBooking] = useState<Booking | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasUnratedBookings, setHasUnratedBookings] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          router.push('/');
          return;
        }
  
        const response = await fetch(`http://127.0.0.1:5000/api/booking/user/${userId}/bookings`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data: ApiResponse = await response.json();
        console.log('All bookings:', data.bookings); 
  
        setBookings(data.bookings); // Make sure this line is present!
  
        const completedBookings = data.bookings.filter(booking => booking.status.toLowerCase() === 'completed');
        
  
        const unratedCompleted = [];
        for (const booking of completedBookings) {
          const reviewStatusResponse = await fetch(
            `http://localhost:5000/api/booking/${booking.id}/user/${userId}/review-status`
          );
          
          if (reviewStatusResponse.ok) {
            const reviewStatus = await reviewStatusResponse.json();
            console.log('Review status for booking', booking.id, ':', reviewStatus);
            if (!reviewStatus.has_reviewed) {
              unratedCompleted.push(booking);
            }
          }
        }
  
        console.log('Unrated completed bookings:', unratedCompleted);
        setUnratedBookings(unratedCompleted);
        setHasUnratedBookings(unratedCompleted.length > 0);
        
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, []);
  
  // Add console log in render
  console.log('Render - bookings:', bookings, 'hasUnratedBookings:', hasUnratedBookings);

  const handleRatingSubmitted = (bookingId: number) => {
    setUnratedBookings(prev => {
      const remaining = prev.filter(b => b.id !== bookingId);
      if (remaining.length > 0) {
        setCurrentRatingBooking(remaining[0]);
        return remaining;
      } else {
        setShowRatingModal(false);
        setCurrentRatingBooking(null);
        setHasUnratedBookings(false);
        return [];
      }
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 flex items-center justify-center`}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show rating requirement message if there are unrated bookings
if (hasUnratedBookings) {
  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4`}>
      <div className="text-center mb-6">
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Please Rate Your Completed Services
        </h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
          You have {unratedBookings.length} completed service{unratedBookings.length > 1 ? 's' : ''} that need{unratedBookings.length === 1 ? 's' : ''} to be rated.
        </p>
      </div>

      {/* Add this section to show unrated bookings */}
      <div className="space-y-4">
        {unratedBookings.map((booking) => (
          <div 
            key={booking.id} 
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}
          >
            <h3 className={`text-[17px] font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {booking.service_title}
            </h3>
            <p className={`text-[15px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Provider: {booking.provider_name}
            </p>
            <p className={`text-[13px] mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatDate(booking.booking_date)} at {formatTime(booking.booking_time)}
            </p>
            <div className="flex items-center mt-2">
              <span className={`text-[13px] ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                Amount: ${booking.total_amount}
              </span>
            </div>
            
            <button
              onClick={() => {
                setCurrentRatingBooking(booking);
                setShowRatingModal(true);
              }}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Rate this service
            </button>
          </div>
        ))}
      </div>

      {currentRatingBooking && showRatingModal && (
        <RatingModal
          booking={currentRatingBooking}
          onClose={() => setShowRatingModal(true)}
          onSubmitRating={handleRatingSubmitted}
        />
      )}

      <BottomNavigation />
    </main>
  );
}

  return (
    <main className={`min-h-screen pb-20 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4">
        <h1 className={`text-[22px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          My Bookings
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Bookings List */}
      <div className="px-4">
        {bookings.length === 0 ? (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No bookings found
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div key={booking.id} className="mb-6">
              {/* Service Name */}
              <h2 className={`text-[17px] font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {booking.service_title}
              </h2>

              {/* Booking Card */}
              <Link 
                href={
                  booking.status.toLowerCase() === 'rejected' 
                    ? `/service-details/${booking.service_id}`
                    : booking.status.toLowerCase() === 'approved'
                    ? `/payment/${booking.id}`
                    : booking.status.toLowerCase() === 'pending'
                    ? `/service-details/${booking.service_id}?status=pending`
                    : `/bookings/${booking.id}`
                }
              >
                <div className={`flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : ''} rounded-lg p-4`}>
                  <div className="flex-1">
                    {/* Status */}
                    <StatusBadge status={booking.status} />

                    {/* Provider Name */}
                    <h3 className={`text-[15px] font-medium mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {booking.provider_name}
                    </h3>

                    {/* Date & Time */}
                    <p className={`text-[13px] mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(booking.booking_date)} at {formatTime(booking.booking_time)}
                    </p>

                    {/* Amount */}
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <span className={`text-[13px] ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          Amount:
                        </span>
                        <span className={`text-[13px] ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          ${booking.total_amount}
                        </span>
                      </div>
                    </div>
                  {/* Add Rating Stats */}
      <div className="mt-2">
        <ServiceRating serviceId={booking.service_id} />
      </div>
    </div>
    <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} ml-2`} />
  </div>
</Link>
 {/* Add Checkout and Cancel buttons for approved bookings */}
 {booking.status.toLowerCase() === 'approved' && (
    <div className="flex gap-2 mt-2 px-4">
      <Link
        href={`/checkout/${booking.id}`}
        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium text-center hover:bg-blue-600 transition-colors"
      >
        Checkout
      </Link>
      <button
        onClick={async () => {
          try {
            const response = await fetch(`http://localhost:5000/api/booking/${booking.id}/status`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ status: 'cancelled' })
            });

            if (!response.ok) throw new Error('Failed to cancel booking');
            
            // Update local state to reflect the cancellation
            setBookings(prevBookings =>
              prevBookings.map(b =>
                b.id === booking.id ? { ...b, status: 'cancelled' } : b
              )
            );
          } catch (error) {
            console.error('Error cancelling booking:', error);
          }
        }}
        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
      >
        Cancel
      </button>
    </div>
  )}

              {/* Divider */}
              {index < bookings.length - 1 && (
                <div className={`border-b mt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`} />
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}