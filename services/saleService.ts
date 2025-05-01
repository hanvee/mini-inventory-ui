import api, { ApiError } from "@/lib/api";
import { ISale, ApiResponse, PaginationParams } from "@/types/models";

export const saleService = {
  /**
   * Get paginated sales with optional search
   */
  getSales: async (
    params: PaginationParams = {}
  ): Promise<ApiResponse<ISale[]>> => {
    try {
      const response = await api.get("/sales", { params });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch sales", undefined, error);
    }
  },

  /**
   * Get a single sale by invoice ID
   */
  getSaleById: async (invoiceId: string): Promise<ISale> => {
    try {
      const response = await api.get(`/sales/${invoiceId}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Failed to fetch sale with invoice ID ${invoiceId}`,
        undefined,
        error
      );
    }
  },

  /**
   * Create a new sale
   */
  createSale: async (saleData: Omit<ISale, "invoice_id">): Promise<ISale> => {
    try {
      const response = await api.post("/sales", saleData);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to create sale", undefined, error);
    }
  },

  /**
   * Delete a sale
   */
  deleteSale: async (invoiceId: string): Promise<void> => {
    try {
      await api.delete(`/sales/${invoiceId}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Failed to delete sale with invoice ID ${invoiceId}`,
        undefined,
        error
      );
    }
  },
};
