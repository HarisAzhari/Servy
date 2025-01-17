const API_URL = 'http://localhost:8000';

export interface Provider {
  id: number;
  name: string;
  image: string;
  role: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  provider: Provider;
  image: string;
}

export const serviceApi = {
  getFeaturedServices: async (): Promise<Service[]> => {
    try {
      const response = await fetch(`${API_URL}/api/featured-services`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured services');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching featured services:', error);
      throw error;
    }
  },

  getCategoryServices: async (categoryPath: string): Promise<Service[]> => {
    try {
      const response = await fetch(`${API_URL}/api/categories/${categoryPath}/services`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch category services');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching category services:', error);
      throw error;
    }
  }
};