const API_URL = 'http://localhost:8000';

export interface Category {
  id: number;
  name: string;
  path: string;
  icon: string;
  services: string;
}

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};