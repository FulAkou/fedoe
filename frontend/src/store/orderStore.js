import { create } from 'zustand';
import api from '../api/client';

export const useOrderStore = create((set, get) => ({
  orders: [],
  userOrders: [],
  isLoading: false,
  error: null,

  createOrder: async (orderData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/orders', orderData);
      set((state) => ({ 
        userOrders: [response.data, ...state.userOrders],
        isLoading: false 
      }));
      return { success: true, order: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  fetchUserOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/orders');
      // If backend returns { orders, pagination }
      const orders = response.data.orders || response.data;
      set({ userOrders: orders, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch your orders', isLoading: false });
    }
  },

  // Admin functionality
  fetchAllOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/orders');
      // If backend returns { orders, pagination }
      const orders = response.data.orders || response.data;
      set({ orders: orders, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch all orders', isLoading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      // Backend uses PUT /orders/:id for updates
      const response = await api.put(`/orders/${orderId}`, { status });
      set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? response.data : o),
        userOrders: state.userOrders.map(o => o.id === orderId ? response.data : o),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to update order status' };
    }
  }
}));
