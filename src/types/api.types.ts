export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  message: string;
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
