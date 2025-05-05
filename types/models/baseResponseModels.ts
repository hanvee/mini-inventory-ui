export interface ApiResponse<T> {
  data: T;
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export interface PaginationParams {
  current_page?: number;
  per_page?: number;
  search?: string;
}

export interface QueryOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  enabled?: boolean;
}
