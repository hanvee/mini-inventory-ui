// services/customerService.ts
import api from '@/lib/api';
import { ICustomer, Res } from '@/types/models';

export const customerService = {
  getCustomers: async (params = {}): Promise<Res<ICustomer>> => {
    try {
      const response = await api.get('/customers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (id: number | string): Promise<ICustomer> => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  },

  createCustomer: async (customerData: Omit<ICustomer, 'id'>): Promise<ICustomer> => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id: number | string, customerData: Partial<ICustomer>): Promise<ICustomer> => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id: number | string): Promise<void> => {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      console.error(`Error deleting customer with ID ${id}:`, error);
      throw error;
    }
  }
};