'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally handle form submission
    // For now, just navigate to the create account page
    router.push('/create-account');
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

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter Name"
            className="w-full p-4 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div>
          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full p-4 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
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
          className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium"
        >
          Signup
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