'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      setLoading(true);
      const response = await fetch('http://beerescue.xyz:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data
      localStorage.setItem('user_id', data.user_id.toString());
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_mobile', data.mobile);

      // Redirect to home page
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl font-semibold">Clean</span>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-sm">
          Log in to your account using email or social networks
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Social Login Buttons */}
      <button className="mb-4 w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-0">
        <img src="/apple3.png" alt="Apple logo" style={{ width: '60px', height: '60px', margin: 0, padding: 0 }} />
        <span className="text-gray-700">Login with Apple</span>
      </button>

      <button className="mb-6 w-full py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2">
        <img src="/api/placeholder/20/20" alt="Google logo" className="w-5 h-5" />
        <span className="text-gray-700">Login with Google</span>
      </button>

      <div className="text-center text-sm text-gray-500 mb-6">
        Or continue with email
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
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

        <div className="text-right">
          <button type="button" className="text-blue-500 text-sm">Forgot Password ?</button>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium disabled:bg-blue-300"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <span className="text-gray-600">Didn't have an account? </span>
        <button 
          onClick={() => router.push('/signup')}
          className="text-blue-500 hover:text-blue-600"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default LoginPage;