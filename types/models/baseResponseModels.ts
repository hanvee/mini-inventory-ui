export interface Res<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
}

export interface UseOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  autoFetch?: boolean;
}

export interface UseState<T> {
  customers: T;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}


