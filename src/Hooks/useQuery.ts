import { useCallback, useEffect, useRef } from 'react';
import { useAtom, PrimitiveAtom } from 'jotai';
import { QueryRequest } from '../Types/request';

type WithInitialValue<Value> = {
  init: Value;
};

type QueryRequestParams<T> = {
  requestAtom: PrimitiveAtom<QueryRequest<T>> & WithInitialValue<QueryRequest<T>>;
  queryFunction?: (...args: any) => Promise<T>;
  autoFetch?: boolean;
  cacheData?: boolean;
};

type QueryResponseParams<T> = {
  loading: boolean;
  refreshing: boolean;
  error?: Error;
  data?: T;
};

type QueryHookResponse<T> = {
  requestData: QueryRequest<T>;
  setData: (data: T) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  fetchData: (refresh?: boolean) => Promise<QueryResponseParams<T>>;
  refreshData: () => Promise<void>;
};

export default function useQuery<T>({ requestAtom, queryFunction, autoFetch = true, cacheData }: QueryRequestParams<T>): QueryHookResponse<T> {
  const [requestData, setRequestData] = useAtom(requestAtom);
  const dataRef = useRef(requestData?.data);
  dataRef.current = requestData?.data;

  const setData = useCallback((data: T) => {
    setRequestData((prev) => ({ ...prev, data }));
  }, [setRequestData]);

  const setLoading = useCallback((loading: boolean) => {
    setRequestData((prev) => ({ ...prev, loading }));
  }, [setRequestData]);

  const setRefreshing = useCallback((refreshing: boolean) => {
    setRequestData((prev) => ({ ...prev, refreshing }));
  }, [setRequestData]);

  const fetchData = useCallback(async (refresh?: boolean) => {
    if (typeof queryFunction !== 'function') {
      const response: QueryResponseParams<T> = {
        data: undefined,
        loading: false,
        error: undefined,
        refreshing: false,
      };
      setRequestData((prev) => ({ ...prev, ...response }));
      return Promise.resolve(response);
    }

    if (!refresh && cacheData && dataRef.current) {
      const response: QueryResponseParams<T> = {
        data: dataRef.current,
        loading: false,
        error: undefined,
        refreshing: false,
      };
      setRequestData((prev) => ({ ...prev, ...response }));
      return Promise.resolve(response);
    }

    setRequestData((prev) => ({
      ...prev,
      loading: !refresh,
      refreshing: refresh,
      error: undefined,
    }));

    try {
      const data = await queryFunction();
      const response: QueryResponseParams<T> = {
        loading: false,
        refreshing: false,
        error: undefined,
        data,
      };
      setRequestData((prev) => ({ ...prev, ...response }));
      return response;
    } catch (error) {
      const response: QueryResponseParams<T> = {
        loading: false,
        refreshing: false,
        error: error as Error,
        data: undefined,
      };
      setRequestData((prev) => ({ ...prev, ...response }));
      return response;
    }
  }, [cacheData, queryFunction, setRequestData]);

  const refreshData = useCallback(async () => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    } else {
      setRequestData((prev) => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: undefined,
      }));
    }
  }, [fetchData, autoFetch, setRequestData]);

  return {
    requestData,
    setData,
    setLoading,
    setRefreshing,
    fetchData,
    refreshData,
  };
}
