/**
 * @file useBranchLoader.ts
 * @description 레포지토리의 브랜치 목록을 로딩하는 커스텀 훅
 */
import { useState, useEffect } from 'react';

import axios from '../api/axiosInstance';

import type { Branch } from '../components/BranchList';

interface UseBranchLoaderReturn {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
}

/**
 * 레포지토리의 브랜치 목록을 로딩하는 커스텀 훅
 * @param repoId - 레포지토리 ID (null이면 로딩하지 않음)
 * @returns 브랜치 목록, 로딩 상태, 에러, 선택된 브랜치 및 setter
 */
export const useBranchLoader = (repoId: number | null): UseBranchLoaderReturn => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    if (!repoId) {
      setBranches([]);
      setSelectedBranch(null);
      setError(null);
      return;
    }

    setLoading(true);
    setSelectedBranch(null);
    setBranches([]);
    setError(null);

    // API 호출로 브랜치 목록 가져오기
    axios
      .get(`/api/v1/github/repos/${repoId}/branches`)
      .then((response) => {
        setBranches(response.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch branches:', err);
        setBranches([]);
        setError('Failed to load branches. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [repoId]);

  return {
    branches,
    loading,
    error,
    selectedBranch,
    setSelectedBranch,
  };
};
