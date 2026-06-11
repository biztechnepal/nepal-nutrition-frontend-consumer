export interface PaginatedResponse<T> {
  data: Array<T>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface APIResponse<T> {
  data: T;
}
