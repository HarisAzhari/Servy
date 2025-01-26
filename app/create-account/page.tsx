"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {
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

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
        <p className="text-gray-500 text-sm">
          Your account has been created successfully.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4">
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
