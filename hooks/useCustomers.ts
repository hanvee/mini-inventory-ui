// hooks/useCustomers.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { ICustomer } from '@/types/models';
import { customerService } from '@/services/customerService';

interface UseCustomersOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  autoFetch?: boolean;
}

interface UseCustomersState {
  customers: ICustomer[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export function useCustomers({
  initialPage = 1,
  initialLimit = 10,
  initialSearch = '',
  autoFetch = true
}: UseCustomersOptions = {}) {
  const [state, setState] = useState<UseCustomersState>({
    customers: [],
    loading: false,
    error: null,
    totalItems: 0,
    currentPage: initialPage,
    pageSize: initialLimit,
    totalPages: 0
  });

  const stateRef = useRef({
    currentPage: initialPage,
    pageSize: initialLimit
  });

  useEffect(() => {
    stateRef.current = {
      currentPage: state.currentPage,
      pageSize: state.pageSize
    };
  }, [state.currentPage, state.pageSize]);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const searchTermRef = useRef(initialSearch);
  
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);
  
  const fetchCustomers = useCallback(async (
    page?: number, 
    limit?: number, 
    search?: string
  ) => {
    // Use provided values or fallback to refs (not state)
    const currentPage = page !== undefined ? page : stateRef.current.currentPage;
    const currentLimit = limit !== undefined ? limit : stateRef.current.pageSize;
    const currentSearch = search !== undefined ? search : searchTermRef.current;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await customerService.getCustomers({
        page: currentPage,
        limit: currentLimit,
        search: currentSearch || undefined
      });
      
      setState(prev => ({
        ...prev,
        customers: response.data,
        loading: false,
        totalItems: response.total,
        currentPage: response.page,
        pageSize: response.limit,
        totalPages: Math.ceil(response.total / response.limit)
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to fetch customers'
      }));
    }
  }, []);

  const createCustomer = useCallback(async (customerData: Omit<ICustomer, 'id'>) => {
    setIsSubmitting(true);
    setOperationError(null);
    
    try {
      await customerService.createCustomer(customerData);
      await fetchCustomers();
      return true;
    } catch (err: any) {
      setOperationError(err.message || 'Error creating customer');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchCustomers]);

  const updateCustomer = useCallback(async (id: number | string, customerData: Partial<ICustomer>) => {
    setIsSubmitting(true);
    setOperationError(null);
    
    try {
      await customerService.updateCustomer(id, customerData);
      await fetchCustomers();
      return true;
    } catch (err: any) {
      setOperationError(err.message || `Error updating customer ${id}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchCustomers]);

  const deleteCustomer = useCallback(async (id: number | string) => {
    setIsSubmitting(true);
    setOperationError(null);
    
    try {
      await customerService.deleteCustomer(id);
      await fetchCustomers();
      return true;
    } catch (err: any) {
      setOperationError(err.message || `Error deleting customer ${id}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchCustomers]);

  const getCustomerById = useCallback(async (id: number | string) => {
    setIsSubmitting(true);
    setOperationError(null);
    
    try {
      const customer = await customerService.getCustomerById(id);
      setSelectedCustomer(customer);
      return customer;
    } catch (err: any) {
      setOperationError(err.message || `Error fetching customer ${id}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    fetchCustomers(1, undefined, value);
  }, [fetchCustomers]);

  const handlePageChange = useCallback((newPage: number) => {
    fetchCustomers(newPage);
  }, [fetchCustomers]);

  const handlePageSizeChange = useCallback((newLimit: number) => {
    fetchCustomers(1, newLimit);
  }, [fetchCustomers]);

  const refreshData = useCallback(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const resetForm = useCallback(() => {
    setSelectedCustomer(null);
    setOperationError(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCustomers(initialPage, initialLimit, initialSearch);
    }
  }, [autoFetch, fetchCustomers, initialPage, initialLimit, initialSearch]);

  return {
    ...state,
    searchTerm,
    isSubmitting,
    operationError,
    selectedCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    refreshData,
    resetForm,
    setSelectedCustomer
  };
}