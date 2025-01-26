// types.ts
export interface Category {
    icon: string;
    name: string;
    services: string;
  }
  
  export interface ServiceProvider {
    name: string;
    avatar: string;
  }
  
  export interface CarpenterService {
    id: number;
    title: string;
    price: number;
    originalPrice: number;
    reviews: number;
    image: string;
    provider: ServiceProvider;
  }
  
  export interface CarpenterServicesProps {
    onBack: () => void;
  }