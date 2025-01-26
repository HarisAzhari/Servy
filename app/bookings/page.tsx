'use client'
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Star, Flag } from 'lucide-react';
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

type Booking = {
  id: number;
  service_id: number;
  service_title: string;
  provider_name: string;
  provider_id: number;
  booking_date: string;
  booking_time: string;
  status: string;
  total_amount: number;
};

type ApiResponse = {
  bookings: Booking[];
};

type ReportModalProps = {
  booking: Booking;
  onClose: () => void;
  onSubmitRating: (bookingId: number) => void;
};

const formatDate = (dateStr: string | number | Date) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

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

const ReportModal = ({ booking, onClose, onSubmitRating }: ReportModalProps) => {
  const { isDarkMode } = useTheme();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const videoInputRef = useRef<HTMLInputElement>(null);

  const submitAutoRating = async () => {
    try {
      const response = await fetch(`http://beerescue.xyz:5000/api/service/${booking.service_id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_id'),
          rating: 1, // Automatically set to 1 star
          review_text: `Report submitted: ${reason}${description ? ' - ' + description : ''}`,
          booking_id: booking.id
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      onSubmitRating(booking.id);
    } catch (error) {
      console.error('Error submitting auto review:', error);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Please upload a valid video file (mp4, mov, avi, mkv)');
        return;
      }

      // Check file size (100MB = 100 * 1024 * 1024 bytes)
      if (file.size > 100 * 1024 * 1024) {
        setUploadError('Video must be less than 100MB');
        return;
      }

      setVideo(file);
      setUploadError('');
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('user_id') || '');
      formData.append('reason', reason);
      if (description) formData.append('description', description);
      if (video) formData.append('video', video);

      const response = await fetch(`http://beerescue.xyz:5000/api/provider/${booking.provider_id}/report`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit report');
      }

      // After successful report submission, submit the 1-star rating
      await submitAutoRating();
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Report Service Provider
        </h2>

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`w-full p-3 rounded-lg mb-4 ${
            isDarkMode 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-50 text-gray-900'
          }`}
        >
          <option value="">Select a reason</option>
          <option value="Unprofessional Conduct">Unprofessional Conduct</option>
          <option value="No Show">No Show</option>
          <option value="Poor Service">Poor Service</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue (optional)"
          className={`w-full p-3 rounded-lg mb-4 ${
            isDarkMode 
              ? 'bg-gray-700 text-white placeholder-gray-400' 
              : 'bg-gray-50 text-gray-900 placeholder-gray-500'
          }`}
          rows={4}
        />

        <div className="mb-4">
          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoChange}
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
            className="hidden"
          />
          
          <button
            onClick={() => videoInputRef.current?.click()}
            className={`w-full p-3 rounded-lg border-2 border-dashed ${
              isDarkMode
                ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            } transition-colors`}
          >
            {video ? video.name : 'Upload Video Evidence (optional, max 100MB)'}
          </button>

          {uploadError && (
            <p className="mt-2 text-sm text-red-500">
              {uploadError}
            </p>
          )}
        </div>

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
            disabled={!reason || isSubmitting}
            className={`px-4 py-2 rounded-lg bg-blue-500 text-white ${
              !reason || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

const RatingModal = ({ booking, onClose, onSubmitRating }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const { isDarkMode } = useTheme();

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://beerescue.xyz:5000/api/service/${booking.service_id}/review`, {
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
        const response = await fetch(`http://beerescue.xyz:5000/api/service/${serviceId}/rating-stats`);
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          router.push('/');
          return;
        }
  
        const response = await fetch(`http://beerescue.xyz:5000/api/booking/user/${userId}/bookings`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data: ApiResponse = await response.json();
  
        setBookings(data.bookings);
  
        const completedBookings = data.bookings.filter(booking => booking.status.toLowerCase() === 'completed');
        
        const unratedCompleted = [];
        for (const booking of completedBookings) {
          const reviewStatusResponse = await fetch(
            `http://beerescue.xyz:5000/api/booking/${booking.id}/user/${userId}/review-status`
          );
          
          if (reviewStatusResponse.ok) {
            const reviewStatus = await reviewStatusResponse.json();
            if (!reviewStatus.has_reviewed) {
              unratedCompleted.push(booking);
            }
          }
        }
  
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

  const handleCancelBooking = async (e: React.MouseEvent, bookingId: number) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    try {
      const response = await fetch(`http://beerescue.xyz:5000/api/booking/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) throw new Error('Failed to cancel booking');
      
      setBookings(prevBookings =>
        prevBookings.map(b =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 flex items-center justify-center`}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setCurrentRatingBooking(booking);
                    setShowRatingModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Rate this service
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedBooking(booking);
                    setShowReportModal(true);
                  }}
                  className="px-4 py-2 rounded-lg flex items-center gap-1 bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentRatingBooking && showRatingModal && (
          <RatingModal
            booking={currentRatingBooking}
            onClose={() => setShowRatingModal(false)}
            onSubmitRating={handleRatingSubmitted}
          />
        )}

        {showReportModal && selectedBooking && (
          <ReportModal
            booking={selectedBooking}
            onClose={() => {
              setShowReportModal(false);
              setSelectedBooking(null);
            }}
            onSubmitRating={handleRatingSubmitted}
          />
        )}

        <BottomNavigation />
      </main>
    );
  }

  // Main bookings list view
  return (
    <main className={`min-h-screen pb-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="p-4">
        <h1 className={`text-[22px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          My Bookings
        </h1>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="px-4">
        {bookings.length === 0 ? (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No bookings found
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div key={booking.id} className="mb-6">
              <h2 className={`text-[17px] font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {booking.service_title}
              </h2>

              <Link 
                href={
                  booking.status.toLowerCase() === 'rejected' 
                    ? `/service-details/${booking.service_id}`
                    : booking.status.toLowerCase() === 'approved'
                    ? `/payment/${booking.id}`
                    : booking.status.toLowerCase() === 'pending'
                    ? `/service-details/${booking.service_id}?status=pending`
                    : `/booking-details/${booking.id}`  // Make sure this matches exactly
                  }
              >
                <div className={`flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : ''} rounded-lg p-4`}>
                  <div className="flex-1">
                    <StatusBadge status={booking.status} />

                    <h3 className={`text-[15px] font-medium mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {booking.provider_name}
                    </h3>

                    <p className={`text-[13px] mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(booking.booking_date)} at {formatTime(booking.booking_time)}
                    </p>

                    <div className="flex items-center mt-2">
                      <span className={`text-[13px] ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        Amount: RM{booking.total_amount}
                      </span>
                    </div>

                    <div className="mt-2">
                      <ServiceRating serviceId={booking.service_id} />
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} ml-2`} />
                </div>
              </Link>

              {/* Only Checkout and Cancel buttons for approved bookings */}
              {booking.status.toLowerCase() === 'approved' && (
                <div className="flex gap-2 mt-2">
                  <Link
                    href={`/checkout/${booking.id}`}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium text-center hover:bg-blue-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={(e) => handleCancelBooking(e, booking.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {index < bookings.length - 1 && (
                <div className={`border-b mt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`} />
              )}
            </div>
          ))
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}