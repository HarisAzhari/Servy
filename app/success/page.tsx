"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
  <img 
    src="/image.png" 
    alt="Clean Logo"
    className="w-16 h-16 object-contain"
  />
</div>
      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-auto w-full text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          Account Created Successfully
        </h2>
        <p className="text-gray-600 mb-6">
          Your account created successfully. Listen your favourite music
        </p>

        <button
          onClick={() => router.push("/home")}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}
