import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';

const carpenterServices = [
  {
    id: 1,
    title: "Furniture Assembly",
    price: 35,
    originalPrice: 40,
    reviews: 112,
    image: "/api/placeholder/400/200",
    provider: {
      name: "John Smith",
      avatar: "/api/placeholder/40/40"
    }
  },
  {
    id: 2,
    title: "Door Installation",
    price: 45,
    originalPrice: 50,
    reviews: 89,
    image: "/api/placeholder/400/200",
    provider: {
      name: "Mike Johnson",
      avatar: "/api/placeholder/40/40"
    }
  },
  {
    id: 3,
    title: "Cabinet Repair",
    price: 30,
    originalPrice: 35,
    reviews: 156,
    image: "/api/placeholder/400/200",
    provider: {
      name: "David Wilson",
      avatar: "/api/placeholder/40/40"
    }
  }
];

const CarpenterServices = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-blue-900" />
          </button>
          <h1 className="text-xl font-semibold text-blue-900">Carpenter Services</h1>
        </div>
        <button>
          <Search className="w-6 h-6 text-blue-900" />
        </button>
      </div>

      {/* Services List */}
      <div className="p-4 space-y-4">
        {carpenterServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-blue-500">★</span>
                ))}
                <span className="text-gray-500 text-sm">({service.reviews} Reviews)</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">{service.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={service.provider.avatar}
                    alt={service.provider.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-600">{service.provider.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-blue-900">${service.price}</span>
                  <span className="text-gray-400 line-through">${service.originalPrice}</span>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarpenterServices;