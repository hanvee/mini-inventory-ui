import api, { ApiError } from '@/lib/api';
import { IProduct, ApiResponse, PaginationParams } from '@/types/models';

export const productService = {
  /**
   * Get paginated products with optional search
   */
  getProducts: async (params: PaginationParams = {}): Promise<ApiResponse<IProduct[]>> => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch customers', undefined, error);
    }
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (id: number | string): Promise<IProduct> => {    
    try {
      const response = await api.get(`/products/${id}`);      
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch product with ID ${id}`, undefined, error);
    }
  },

  /**
   * Create a new product
   */
  createProduct: async (productData: Omit<IProduct, 'product_code'>): Promise<IProduct> => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create customer', undefined, error);
    }
  },

  /**
   * Update an existing product
   */
  updateProduct: async (id: number | string, productData: Partial<IProduct>): Promise<IProduct> => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update product with ID ${id}`, undefined, error);
    }
  },

  /**
   * Delete a product
   */
  deleteProduct: async (id: number | string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete product with ID ${id}`, undefined, error);
    }
  }
};