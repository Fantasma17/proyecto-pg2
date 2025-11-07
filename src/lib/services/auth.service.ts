import api from '@/lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'psicologo' | 'paciente';
  phone?: string;
  age?: number;
  notes?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    
    // Guardar token y usuario en localStorage
    localStorage.setItem('metapsis_token', response.data.token);
    localStorage.setItem('metapsis_current_user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  logout() {
    localStorage.removeItem('metapsis_token');
    localStorage.removeItem('metapsis_current_user');
    window.location.href = '/login';
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('metapsis_current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem('metapsis_token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();