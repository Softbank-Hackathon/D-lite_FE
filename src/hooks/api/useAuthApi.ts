/**
 * @file useAuthApi.ts
 * @description 인증 관련 API 훅
 */
import { useQuery, useMutation } from '../useApi';
import type {
  AuthStatusResponse,
  User,
  AssumeRoleRequest,
  AssumeRoleResponse,
  RegistrationTokenRequest,
  RegistrationTokenResponse,
  QuickCreateLinkRequest,
  QuickCreateLinkResponse,
} from '../../types/api';

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

/**
 * AWS Role Assume 훅
 * POST /api/auth/assume-role
 */
export function useAssumeRole() {
  return useMutation<AssumeRoleResponse, AssumeRoleRequest>(
    '/api/auth/assume-role',
    'post'
  );
}

/**
 * Registration Token 생성 훅
 * POST /api/auth/registration-token
 */
export function useRegistrationToken() {
  return useMutation<RegistrationTokenResponse, RegistrationTokenRequest>(
    '/api/auth/registration-token',
    'post'
  );
}

/**
 * Quick Create Link 생성 훅
 * POST /api/auth/quick-create-link
 */
export function useQuickCreateLink() {
  return useMutation<QuickCreateLinkResponse, QuickCreateLinkRequest>(
    '/api/auth/quick-create-link',
    'post'
  );
}
