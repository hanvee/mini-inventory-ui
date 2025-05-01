import api, { ApiError } from '@/lib/api';
import { ICustomer, ApiResponse, PaginationParams } from '@/types/models';

export const customerService = {
  /**
   * Get paginated customers with optional search
   */
  getCustomers: async (params: PaginationParams = {}): Promise<ApiResponse<ICustomer[]>> => {
    try {
      const response = await api.get('/customers', { params });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch customers', undefined, error);
    }
  },

  /**
   * Get a single customer by ID
   */
  getCustomerById: async (id: number | string): Promise<ICustomer> => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch customer with ID ${id}`, undefined, error);
    }
  },

  /**
   * Create a new customer
   */
  createCustomer: async (customerData: Omit<ICustomer, 'id'>): Promise<ICustomer> => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create customer', undefined, error);
    }
  },

  /**
   * Update an existing customer
   */
  updateCustomer: async (id: number | string, customerData: Partial<ICustomer>): Promise<ICustomer> => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update customer with ID ${id}`, undefined, error);
    }
  },

  /**
   * Delete a customer
   */
  deleteCustomer: async (id: number | string): Promise<void> => {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete customer with ID ${id}`, undefined, error);
    }
  }
};