/**
 * @file useBranchLoader.ts
 * @description 레포지토리의 브랜치 목록을 로딩하는 커스텀 훅
 */
import { useState, useEffect } from 'react';

import axios from '../api/axiosInstance';
import type { GithubBranch } from '../types/api';

interface UseBranchLoaderReturn {
  branches: GithubBranch[];
  loading: boolean;
  error: string | null;
  selectedBranch: GithubBranch | null;
  setSelectedBranch: (branch: GithubBranch | null) => void;
}

interface RepoIdentifier {
  owner: string;
  repo: string;
}

/**
 * 레포지토리의 브랜치 목록을 로딩하는 커스텀 훅
 * @param repoIdentifier - 레포지토리 소유자와 이름 (null이면 로딩하지 않음)
 * @returns 브랜치 목록, 로딩 상태, 에러, 선택된 브랜치 및 setter
 */
export const useBranchLoader = (repoIdentifier: RepoIdentifier | null): UseBranchLoaderReturn => {
  const [branches, setBranches] = useState<GithubBranch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<GithubBranch | null>(null);

  useEffect(() => {
    if (!repoIdentifier) {
      setBranches([]);
      setSelectedBranch(null);
      setError(null);
      return;
    }

    const { owner, repo } = repoIdentifier;

    setLoading(true);
    setSelectedBranch(null);
    setBranches([]);
    setError(null);

    // API 호출로 브랜치 목록 가져오기 (owner/repo 형식)
    axios
      .get<GithubBranch[]>(`/api/v1/github/repos/${owner}/${repo}/branches`)
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
  }, [repoIdentifier]);

  return {
    branches,
    loading,
    error,
    selectedBranch,
    setSelectedBranch,
  };
};
