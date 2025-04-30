import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { customerService } from '@/services/customerService';
import { ICustomer, QueryOptions, PaginationParams } from '@/types/models';

const CUSTOMERS_QUERY_KEY = 'customers';
const CUSTOMER_DETAIL_KEY = 'customer-detail';

export function useCustomers({
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

  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);

  const customersQuery = useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, pagination],
    queryFn: () => customerService.getCustomers(pagination),
    enabled: enabled
  });

  const getCustomerById = useCallback(
    async (id: number | string) => {
      try {
        const customer = await queryClient.fetchQuery({
          queryKey: [CUSTOMER_DETAIL_KEY, id],
          queryFn: () => customerService.getCustomerById(id)
        });
        setSelectedCustomer(customer);
        return customer;
      } catch (error: any) {
        toast.error(error.message || `Error fetching customer ${id}`);
        return null;
      }
    },
    [queryClient]
  );

  const createCustomerMutation = useMutation({
    mutationFn: (customerData: Omit<ICustomer, 'id'>) => 
      customerService.createCustomer(customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
      toast.success('Customer created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create customer');
    }
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<ICustomer> }) => 
      customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
      toast.success('Customer updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update customer');
    }
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: number | string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete customer');
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
    queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
  }, [queryClient]);

  const resetForm = useCallback(() => {
    setSelectedCustomer(null);
  }, []);

  return {
    customers: customersQuery.data?.data || [],
    totalItems: customersQuery.data?.total || 0,
    currentPage: customersQuery.data?.page || pagination.page,
    pageSize: customersQuery.data?.limit || pagination.limit,
    totalPages: customersQuery.data 
      ? Math.ceil(customersQuery.data.total / customersQuery.data.limit)
      : 0,
    
    loading: customersQuery.isLoading,
    isLoading: customersQuery.isLoading,
    isError: customersQuery.isError,
    error: customersQuery.error?.message || null,
    
    selectedCustomer,
    setSelectedCustomer,
    
    isCreating: createCustomerMutation.isPending,
    isUpdating: updateCustomerMutation.isPending,
    isDeleting: deleteCustomerMutation.isPending,
    
    isSubmitting: 
      createCustomerMutation.isPending || 
      updateCustomerMutation.isPending || 
      deleteCustomerMutation.isPending,

    operationError: 
      createCustomerMutation.error?.message || 
      updateCustomerMutation.error?.message ||
      deleteCustomerMutation.error?.message,
    
    searchTerm: pagination.search || '',
    
    createCustomer: createCustomerMutation.mutateAsync,
    updateCustomer: (id: number | string, data: Partial<ICustomer>) => 
      updateCustomerMutation.mutateAsync({ id, data }),
    deleteCustomer: deleteCustomerMutation.mutateAsync,
    getCustomerById,
    
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    refreshData,
    resetForm
  };
}