export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface QueryOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  enabled?: boolean;
}