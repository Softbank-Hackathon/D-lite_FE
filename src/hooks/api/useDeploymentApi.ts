/**
 * @file useDeploymentApi.ts
 * @description 배포 관련 API 훅
 */
import { useQuery, useMutation } from '../useApi';
import type { ApiResponse, DeploymentStatusResponse } from '../../types/api';

/**
 * 배포 요청 데이터 타입
 */
export interface CreateDeploymentRequest {
  githubRepositoryUrl: string;
  projectType: 'frontend' | 'backend';
  frameworkType: string;
  environmentVariables?: string; // JSON 문자열
  region: string;
  projectName: string;
  roleArn: string;
  externalId: string;
}

/**
 * 배포 시작 훅
 * POST /api/v1/deployments/deployment-project
 */
export function useCreateDeployment(options?: {
  onSuccess?: (data: ApiResponse<string>) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<ApiResponse<string>, CreateDeploymentRequest>(
    '/api/v1/deployments/deployment-project',
    'post',
    options
  );
}

/**
 * 배포 상태 조회 훅
 * GET /api/v1/deployments/:deploymentId/status
 * @param deploymentId 배포 ID
 * @param enabled 자동 실행 여부
 * @param refetchInterval 자동 재요청 간격 (ms, 폴링용)
 */
export function useDeploymentStatus(
  deploymentId: string | null,
  enabled = true,
  refetchInterval?: number
) {
  const isEnabled = enabled && !!deploymentId;
  const url = deploymentId ? `/api/v1/deployments/${deploymentId}/status` : '';

  const result = useQuery<DeploymentStatusResponse>(url, {
    enabled: isEnabled,
    refetchOnMount: true,
  });

  // 폴링 로직 (옵션)
  if (refetchInterval && isEnabled) {
    // 추후 setInterval 또는 useEffect로 구현 가능
    // 현재는 수동 refetch 사용
  }

  return result;
}
