export type QueryRequest<T> = {
  loading: boolean;
  refreshing?: boolean;
  error?: Error;
  data?: T;
  fetched?: boolean;
};

export interface PaginatedQueryRequest<T, K> extends QueryRequest<Array<T>> {
  isFetchingMore: boolean;
  fetched?: boolean;
  paginationData?: K & { hasMore: boolean };
  hasMore?: boolean;
  refreshing?: boolean;
}

export type QueryRequestFamilyParam<T> = {
  id: string;
  data?: QueryRequest<T>;
};

export type PaginatedQueryRequestFamilyParam<T, K> = {
  id: string;
  data?: PaginatedQueryRequest<T, K>;
};

export type RequestFamilyParam<T> = {
  id: string;
  data?: QueryRequest<T>;
};
