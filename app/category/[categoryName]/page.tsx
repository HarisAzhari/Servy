'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Star } from 'lucide-react';
import BottomNavigation from '../../../components/navigation/BottomNavigation';

interface Provider {
  name: string;
  image: string;
}

interface Service {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  provider: Provider;
  image: string;
}

const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <Link href={`/service-details/${service.id}/`} className="block">
      <div className="bg-service-card-bg rounded-xl overflow-hidden mb-4 shadow-sm">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center mb-2">
            {[...Array(service.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-rating-color text-rating-color" />
            ))}
            <span className="text-sm text-text-secondary ml-2">({service.reviews} Reviews)</span>
          </div>
          <h3 className="font-medium text-lg mb-1 text-text-primary">{service.title}</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img
                src={service.provider.image}
                alt={service.provider.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-text-secondary">{service.provider.name}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-price-color">${service.price}</span>
              <span className="text-sm text-text-secondary line-through ml-2">
                ${service.originalPrice}
              </span>
            </div>
            <button 
              className="bg-nav-active text-white px-6 py-2 rounded-lg text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                // Add your cart logic here
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function CategoryServicesPage({ params }: { params: Promise<{ categoryName: string }> }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryName = React.use(params).categoryName;

  useEffect(() => {
    const fetchServices = async () => {
      if (!categoryName) return;
      
      try {
        const response = await fetch(`http://localhost:8000/api/categories/${categoryName}/services`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryName]);

  if (loading) {
    return <div className="p-4 text-text-primary">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card-background p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/category">
            <ChevronLeft className="w-6 h-6 text-text-primary" />
          </Link>
          <h1 className="text-xl font-semibold text-text-primary">Services for {categoryName}</h1>
        </div>
        <button>
          <Search className="w-6 h-6 text-text-primary" />
        </button>
      </div>

      {/* Services List */}
      <div className="p-4">
        {services.length > 0 ? (
          services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <div className="text-center py-4 text-text-secondary">
            No services found for this category
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}