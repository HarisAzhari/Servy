const API_URL = 'http://localhost:8000';

export interface Address {
  id: number;
  user_id: number;
  type: string;
  address: string;
  city: string;
  is_default: boolean;
}

export interface AddAddressData {
  type: string;
  address: string;
  city: string;
  is_default: boolean;
}

export const addressApi = {
  getAddresses: async (token: string): Promise<Address[]> => {
    try {
      const response = await fetch(`${API_URL}/api/address`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch addresses');
      }

      return response.json();
    } catch (error) {
      console.error('Get addresses error:', error);
      throw error;
    }
  },

  addAddress: async (token: string, data: AddAddressData): Promise<Address> => {
    try {
      const response = await fetch(`${API_URL}/api/address`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add address');
      }

      return response.json();
    } catch (error) {
      console.error('Add address error:', error);
      throw error;
    }
  },

  updateAddress: async (token: string, id: number, data: AddAddressData): Promise<Address> => {
    try {
      const response = await fetch(`${API_URL}/api/address/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update address');
      }

      return response.json();
    } catch (error) {
      console.error('Update address error:', error);
      throw error;
    }
  },

  deleteAddress: async (token: string, id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/address/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete address');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Delete address error:', error);
      throw error;
    }
  }
};