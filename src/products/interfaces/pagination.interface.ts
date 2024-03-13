export interface PaginationResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}
