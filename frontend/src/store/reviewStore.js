import { create } from 'zustand';
import api from '../api/client';

export const useReviewStore = create((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  fetchReviewsByDish: async (dishId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/reviews?dishId=${dishId}`);
      // The backend returns { reviews: [...], pagination: {...} } or just [...] depending on implementation?
      // Controller says res.json({ reviews, pagination })
      set({ reviews: response.data.reviews || [], isLoading: false });
    } catch (error) {
      console.error('Fetch reviews error:', error);
      set({ error: 'Failed to fetch reviews', isLoading: false });
    }
  },

  addReview: async (dishId, reviewData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/reviews', { ...reviewData, dishId });
      set((state) => ({
        reviews: [response.data, ...state.reviews],
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Add review error:', error);
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to submit review';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  fetchAllReviews: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/reviews', { params });
      set({ reviews: response.data.reviews || [], isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch reviews', isLoading: false });
    }
  },

  updateReviewStatus: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/reviews/${id}`, data);
      set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? response.data : r),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: 'Failed to update review', isLoading: false });
      return { success: false };
    }
  },

  deleteReview: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/reviews/${id}`);
      set((state) => ({
        reviews: state.reviews.filter(r => r.id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: 'Failed to delete review', isLoading: false });
      return { success: false };
    }
  }
}));
