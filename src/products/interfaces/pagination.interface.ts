export interface PaginationResponse<T> {
  paginationData: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}
