/**
 * @file useDataFilter.ts
 * @description 데이터 필터링 및 정렬을 처리하는 커스텀 훅 (DashboardPage용)
 */
import { useMemo } from 'react';

import type { ProjectData } from '../components/DataTable';
import type { FilterValues } from '../components/Filters';

/**
 * 날짜 포맷팅 유틸 함수
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * 프로젝트 데이터를 필터링 및 정렬하는 커스텀 훅
 * @param data - 원본 프로젝트 데이터 배열
 * @param filters - 필터 값 (framework, date, status)
 * @returns 필터링 및 정렬된 데이터 (날짜 포맷팅 포함)
 */
export const useDataFilter = (data: ProjectData[], filters: FilterValues): ProjectData[] => {
  return useMemo(() => {
    let filteredData = [...data];

    // Framework 필터링
    if (filters.framework !== 'all') {
      filteredData = filteredData.filter((item) => item.framework === filters.framework);
    }

    // Status 필터링
    if (filters.status !== 'all') {
      filteredData = filteredData.filter((item) => item.status === filters.status);
    }

    // 날짜 기준 정렬
    filteredData.sort((a, b) => {
      const dateA = new Date(a.recentDate).getTime();
      const dateB = new Date(b.recentDate).getTime();
      return filters.date === 'recent' ? dateB - dateA : dateA - dateB;
    });

    // 날짜 포맷팅 적용
    return filteredData.map((item) => ({
      ...item,
      recentDate: formatDate(item.recentDate),
    }));
  }, [data, filters]);
};
