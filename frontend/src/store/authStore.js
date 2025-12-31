import { create } from 'zustand';
import api from '../api/client';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signin', { email, password });
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signup', userData);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }

  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/users/profile', data);
      set((state) => ({ 
        user: { ...state.user, ...response.data }, 
        isLoading: false 
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Update failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const response = await api.get('/auth/me');
      const user = response.data.user || response.data;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
