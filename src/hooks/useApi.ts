/**
 * @file useApi.ts
 * @description API 호출을 위한 공통 커스텀 훅
 * React Query와 유사한 패턴으로 구현
 */
import { useState, useEffect, useCallback } from 'react';
import type { AxiosRequestConfig, AxiosError } from 'axios';

import axiosInstance from '../api/axiosInstance';

// ============================================
// Types
// ============================================

interface UseQueryOptions<T> extends Omit<AxiosRequestConfig, 'url'> {
  enabled?: boolean; // false면 자동 실행 안 함
  refetchOnMount?: boolean; // 마운트 시 재요청 여부
  retry?: number; // 재시도 횟수
  retryDelay?: number; // 재시도 간격 (ms)
  onSuccess?: (data: T) => void; // 성공 콜백
  onError?: (error: AxiosError) => void; // 에러 콜백
}

interface UseQueryResult<T> {
  data: T | null;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

interface UseMutationOptions<TData> extends Omit<AxiosRequestConfig, 'url' | 'data'> {
  onSuccess?: (data: TData) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void; // 성공/실패와 관계없이 항상 호출
}

interface UseMutationResult<TData, TVariables> {
  data: TData | null;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  mutate: (variables: TVariables) => Promise<void>;
  reset: () => void;
}

// ============================================
// useQuery Hook (GET 요청용)
// ============================================

/**
 * GET 요청을 위한 커스텀 훅
 * @param url API 엔드포인트 URL
 * @param options 옵션 설정
 * @returns 쿼리 결과 및 제어 함수
 */
export function useQuery<T = unknown>(
  url: string,
  options: UseQueryOptions<T> = {}
): UseQueryResult<T> {
  const {
    enabled = true,
    refetchOnMount = true,
    retry = 0,
    retryDelay = 1000,
    onSuccess,
    onError,
    ...axiosConfig
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<T>(url, axiosConfig);
      setData(response.data);
      setError(null);
      setRetryCount(0); // 성공 시 재시도 카운트 리셋
      
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      
      // 재시도 로직
      if (retryCount < retry) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, retryDelay);
      } else {
        setError(axiosError);
        if (onError) {
          onError(axiosError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled, retryCount, retry, retryDelay, onSuccess, onError, axiosConfig]);

  // 재시도 카운트가 변경되면 다시 요청
  useEffect(() => {
    if (retryCount > 0 && retryCount <= retry) {
      fetchData();
    }
  }, [retryCount, retry, fetchData]);

  // 초기 마운트 시 또는 조건 변경 시 요청
  useEffect(() => {
    if (enabled && (refetchOnMount || !data)) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled, refetchOnMount]); // fetchData는 의도적으로 제외 (무한 루프 방지)

  const refetch = useCallback(async () => {
    setRetryCount(0); // 수동 refetch 시 재시도 카운트 리셋
    await fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    isSuccess: data !== null && error === null,
    refetch,
  };
}

// ============================================
// useMutation Hook (POST/PUT/DELETE 요청용)
// ============================================

/**
 * POST/PUT/DELETE 요청을 위한 커스텀 훅
 * @param url API 엔드포인트 URL
 * @param method HTTP 메서드
 * @param options 옵션 설정
 * @returns 뮤테이션 결과 및 제어 함수
 */
export function useMutation<TData = unknown, TVariables = unknown>(
  url: string,
  method: 'post' | 'put' | 'delete' = 'post',
  options: UseMutationOptions<TData> = {}
): UseMutationResult<TData, TVariables> {
  const { onSuccess, onError, onSettled, ...axiosConfig } = options;

  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance[method]<TData>(url, variables, axiosConfig);
        setData(response.data);
        setError(null);

        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);

        if (onError) {
          onError(axiosError);
        }
      } finally {
        setIsLoading(false);

        if (onSettled) {
          onSettled();
        }
      }
    },
    [url, method, onSuccess, onError, onSettled, axiosConfig]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    isSuccess: data !== null && error === null,
    mutate,
    reset,
  };
}
