import { create } from 'zustand';
import api from '../api/client';

export const useUserStore = create((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },

  getAllUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/users', { params });
      set({ 
        users: response.data.users, 
        pagination: response.data.pagination,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch users', isLoading: false });
    }
  },

  getUserById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/users/${id}`);
      set({ selectedUser: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user details', isLoading: false });
    }
  },

  updateUser: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/users/${id}`, data);
      set((state) => ({
        users: state.users.map(u => u.id === id ? response.data : u),
        selectedUser: response.data,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: 'Failed to update user', isLoading: false });
      return { success: false, message: error.response?.data?.message };
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/users/${id}`);
      set((state) => ({
        users: state.users.filter(u => u.id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: 'Failed to delete user', isLoading: false });
      return { success: false, message: error.response?.data?.message };
    }
  }
}));
