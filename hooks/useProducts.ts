import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { productService } from '@/services';
import { IProduct, QueryOptions, PaginationParams } from '@/types/models';

const PRODUCTS_QUERY_KEY = 'products';
const PRODUCT_DETAIL_KEY = 'product-detail';

export function useProducts({
  initialPage = 1,
  initialLimit = 10,
  initialSearch = '',
  enabled = true
}: QueryOptions = {}) {
  const queryClient = useQueryClient();
  
  const [pagination, setPagination] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit,
    search: initialSearch || undefined
  });

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const productQuery = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, pagination],
    queryFn: () => productService.getProducts(pagination),
    enabled: enabled
  });

  const getProductById = useCallback(
    async (id: number | string) => {    
      try {
        const product = await queryClient.fetchQuery({
          queryKey: [PRODUCT_DETAIL_KEY, id],
          queryFn: () => productService.getProductById(id)
        });
        setSelectedProduct(product);
        return product;
      } catch (error: any) {
        toast.error(error.message || `Error fetching product ${id}`);
        return null;
      }
    },
    [queryClient]
  );

  const createProductMutation = useMutation({
    mutationFn: (productData: Omit<IProduct, 'id'>) => 
      productService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<IProduct> }) => 
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number | string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    }
  });

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, page: 1, limit }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setPagination(prev => ({ ...prev, page: 1, search: search || undefined }));
  }, []);

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
  }, [queryClient]);

  const resetForm = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return {
    products: productQuery.data?.data || [],
    totalItems: productQuery.data?.total || 0,
    currentPage: productQuery.data?.page || pagination.page,
    pageSize: productQuery.data?.limit || pagination.limit,
    totalPages: productQuery.data 
      ? Math.ceil(productQuery.data.total / productQuery.data.limit)
      : 0,
    
    loading: productQuery.isLoading,
    isLoading: productQuery.isLoading,
    isError: productQuery.isError,
    error: productQuery.error?.message || null,
    
    selectedProduct,
    setSelectedProduct,
    
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    
    isSubmitting: 
      createProductMutation.isPending ||
      updateProductMutation.isPending || 
      deleteProductMutation.isPending,

    operationError: 
      createProductMutation.error?.message ||
      updateProductMutation.error?.message ||
      deleteProductMutation.error?.message,
    
    searchTerm: pagination.search || '',
    
    createProduct: createProductMutation.mutateAsync,
    updateProduct: (id: number | string, data: Partial<IProduct>) => 
      updateProductMutation.mutateAsync({ id, data }),
    deleteProduct: deleteProductMutation.mutateAsync,
    getProductById,
    
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    refreshData,
    resetForm
  };
}