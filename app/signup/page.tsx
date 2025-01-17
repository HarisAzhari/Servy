'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await api.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      // Store the token
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user_type', response.user_type);
      localStorage.setItem('user_id', response.user_id.toString());

      // Redirect to create account success page
      router.push('/create-account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl font-semibold">Clean</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New Account</h1>
        <p className="text-gray-500 text-sm">
          Set up your username and password. You can always change it later.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Name"
            className="w-full p-4 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-4 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full p-4 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-4 border border-gray-300 rounded-lg pr-12"
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? 
              <EyeOff className="w-5 h-5 text-gray-500" /> : 
              <Eye className="w-5 h-5 text-gray-500" />
            }
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-Enter Password"
            className="w-full p-4 border border-gray-300 rounded-lg pr-12"
            required
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? 
              <EyeOff className="w-5 h-5 text-gray-500" /> : 
              <Eye className="w-5 h-5 text-gray-500" />
            }
          </button>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium disabled:bg-blue-300"
        >
          {loading ? 'Creating Account...' : 'Signup'}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <span className="text-gray-600">Already have an account? </span>
        <button 
          onClick={() => router.push('/')}
          className="text-blue-500"
        >
          Login
        </button>
      </div>
    </main>
  );
}