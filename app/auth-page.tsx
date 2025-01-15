'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

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
          Log in to your account using mobile number or social networks
        </p>
      </div>

     {/* Social Login Buttons */}
<button className="mb-4 w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-0">
<img src="/apple3.png" alt="Apple logo" style={{ width: '60px', height: '60px', margin: 0, padding:0 }} />
<span className="text-gray-700">Login with Apple</span>
</button>

      <button className="mb-6 w-full py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2">
        <img src="/api/placeholder/20/20" alt="Google logo" className="w-5 h-5" />
        <span className="text-gray-700">Login with Google</span>
      </button>

      <div className="text-center text-sm text-gray-500 mb-6">
        Or continue with social account
      </div>

      {/* Login Form */}
      <div className="space-y-4">
        <div>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            className="w-full p-4 border border-gray-300 rounded-lg"
          />
        </div>
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-4 border border-gray-300 rounded-lg pr-12"
          />
          <button 
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
          <button className="text-blue-500 text-sm">Forgot Password ?</button>
        </div>

        <button className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium">
          Login
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <span className="text-gray-600">Didnt have an account? </span>
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