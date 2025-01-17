const API_URL = 'http://localhost:8000/api';

export interface UserRegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  profile_image?: string;
}

export interface LoginData {
  username: string;  // email
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  user_type: string;
}

export const api = {
  register: async (userData: UserRegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  login: async (loginData: LoginData): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);

    const response = await fetch(`${API_URL}/auth/user/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  },

  getMe: async (token: string) => {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return response.json();
  },
};  