/**
 * @file useAuthApi.ts
 * @description 인증 관련 API 훅
 */
import { useQuery } from '../useApi';
import type { AuthStatusResponse, User } from '../../types/api';

/**
 * 인증 상태 확인 훅
 * GET /
 */
export function useAuthStatus(enabled = true) {
  return useQuery<AuthStatusResponse>('/', {
    enabled,
    refetchOnMount: true,
  });
}

/**
 * 현재 사용자 정보 조회 훅
 * GET /api/users/me
 */
export function useUserInfo(enabled = true) {
  return useQuery<User>('/api/users/me', {
    enabled,
    refetchOnMount: false, // 인증 상태 확인 후 한 번만 호출
  });
}
