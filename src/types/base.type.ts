export type BaseAPIResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type BasePaginationResponse<T> = {
  items: T[];
  totalCount: number;
  currentData: number;
  totalPages: number;
  currentPage: number;
};
