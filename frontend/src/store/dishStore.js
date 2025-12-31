import { create } from 'zustand';
import api from '../api/client';

export const useDishStore = create((set, get) => ({
  dishes: [],
  categories: [],
  featuredDishes: [],
  selectedDish: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },

  fetchDishes: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/dishes', { params });
      // The backend seems to return paginated data: { dishes, pagination }
      set({ 
        dishes: response.data.dishes, 
        pagination: response.data.pagination,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch dishes', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.get('/dishes/categories');
      set({ categories: response.data });
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  },

  fetchFeaturedDishes: async () => {
    try {
      const response = await api.get('/dishes/featured');
      set({ featuredDishes: response.data });
    } catch (error) {
      console.error('Failed to fetch featured dishes', error);
    }
  },

  fetchDishById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/dishes/${id}`);
      set({ selectedDish: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch dish details', isLoading: false });
    }
  },

  createDish: async (dishData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/dishes', dishData);
      set((state) => ({
        dishes: [response.data, ...state.dishes],
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: 'Failed to create dish', isLoading: false });
      return { success: false, message: error.response?.data?.error || 'Create failing' };
    }
  },

  updateDish: async (id, dishData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/dishes/${id}`, dishData);
      set((state) => ({
        dishes: state.dishes.map(d => d.id === id ? response.data : d),
        selectedDish: response.data,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: 'Failed to update dish', isLoading: false });
      return { success: false, message: error.response?.data?.error || 'Update failing' };
    }
  },

  deleteDish: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/dishes/${id}`);
      set((state) => ({
        dishes: state.dishes.filter(d => d.id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: 'Failed to delete dish', isLoading: false });
      return { success: false, message: error.response?.data?.error || 'Delete failing' };
    }
  },
}));
