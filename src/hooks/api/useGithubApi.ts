/**
 * @file useGithubApi.ts
 * @description GitHub 연동 관련 API 훅
 */
import { useQuery } from '../useApi';
import type { GithubRepository, GithubBranch } from '../../types/api';

/**
 * GitHub 레포지토리 목록 조회 훅
 * GET /api/v1/github/repos
 */
export function useRepositories(enabled = true) {
  return useQuery<GithubRepository[]>('/api/v1/github/repos', {
    enabled,
    refetchOnMount: true,
  });
}

/**
 * GitHub 브랜치 목록 조회 훅
 * GET /api/v1/github/repos/:owner/:repo/branches
 * @param owner 레포지토리 소유자
 * @param repo 레포지토리 이름
 * @param enabled 자동 실행 여부
 */
export function useBranches(
  owner: string | null,
  repo: string | null,
  enabled = true
) {
  const isEnabled = enabled && !!owner && !!repo;
  const url = owner && repo ? `/api/v1/github/repos/${owner}/${repo}/branches` : '';

  return useQuery<GithubBranch[]>(url, {
    enabled: isEnabled,
    refetchOnMount: false, // 레포지토리 선택 시 한 번만 호출
  });
}
