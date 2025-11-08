/**
 * @file useSearchFilter.ts
 * @description 제네릭 검색 필터링 커스텀 훅
 * 배열의 특정 키를 기준으로 검색 쿼리에 맞는 항목을 필터링
 */
import { useMemo } from 'react';

/**
 * 배열의 특정 키를 기준으로 검색 필터링을 수행하는 커스텀 훅
 * @template T - 배열 항목의 타입
 * @param items - 필터링할 배열
 * @param searchQuery - 검색 쿼리
 * @param searchKey - 검색할 키 (T의 속성)
 * @returns 필터링된 배열
 */
export const useSearchFilter = <T,>(
  items: T[],
  searchQuery: string,
  searchKey: keyof T
): T[] => {
  return useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return items;
    }

    const lowerQuery = searchQuery.toLowerCase();

    return items.filter((item) => {
      const value = item[searchKey];
      return String(value).toLowerCase().includes(lowerQuery);
    });
  }, [items, searchQuery, searchKey]);
};
