import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { saleService } from "@/services";
import { ISale, QueryOptions, PaginationParams } from "@/types/models";

const SALES_QUERY_KEY = "sales";
const SALE_DETAIL_KEY = "sale-detail";

export function useSales({
  initialPage = 1,
  initialLimit = 10,
  initialSearch = "",
  enabled = true,
}: QueryOptions = {}) {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationParams>({
    current_page: initialPage,
    per_page: initialLimit,
    search: initialSearch || undefined
  });
  
  const [selectedSale, setSelectedSale] = useState<ISale | null>(null);

  const salesQuery = useQuery({
    queryKey: [SALES_QUERY_KEY, pagination],
    queryFn: () => saleService.getSales(pagination),
    enabled: enabled,
  });

  const getSaleById = useCallback(
    async (invoiceId: string) => {
      try {
        const sale = await queryClient.fetchQuery({
          queryKey: [SALE_DETAIL_KEY, invoiceId],
          queryFn: () => saleService.getSaleById(invoiceId),
        });
        setSelectedSale(sale);
        return sale;
      } catch (error: any) {
        toast.error(error.message || `Error fetching sale ${invoiceId}`);
        return null;
      }
    },
    [queryClient]
  );

  const createSaleMutation = useMutation({
    mutationFn: (saleData: Omit<ISale, "invoice_id">) =>
      saleService.createSale(saleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SALES_QUERY_KEY] });
      toast.success("Sale created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create sale");
    },
  });

  const deleteSaleMutation = useMutation({
    mutationFn: (invoiceId: string) => saleService.deleteSale(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SALES_QUERY_KEY] });
      toast.success("Sale deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete sale");
    },
  });

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, page: 1, per_page: limit }));
  }, []);

  const handleSearch = useCallback((search: string) => {    
    setPagination(prev => ({ ...prev, page: 1, search: search }));
  }, []);

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [SALES_QUERY_KEY] });
  }, [queryClient]);

  const resetForm = useCallback(() => {
    setSelectedSale(null);
  }, []);

  return {
    sales: salesQuery.data?.data || [],
    totalItems: salesQuery.data?.total || 0,
    currentPage: salesQuery.data?.current_page || pagination.current_page,
    pageSize: salesQuery.data?.per_page || pagination.per_page,
    totalPages: salesQuery.data?.last_page || 0,

    loading: salesQuery.isLoading,
    error: salesQuery.error?.message || null,

    selectedSale,
    setSelectedSale,

    isSubmitting: createSaleMutation.isPending || deleteSaleMutation.isPending,

    operationError:
      createSaleMutation.error?.message || deleteSaleMutation.error?.message,

    searchTerm: pagination.search || "",

    createSale: createSaleMutation.mutateAsync,
    deleteSale: deleteSaleMutation.mutateAsync,
    getSaleById,

    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    refreshData,
    resetForm,
  };
}
