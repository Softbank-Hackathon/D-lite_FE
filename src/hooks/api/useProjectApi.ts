/**
 * @file useProjectApi.ts
 * @description 프로젝트 관련 API 훅
 */
import { useQuery, useMutation } from '../useApi';
import type { ApiResponse, Project } from '../../types/api';

/**
 * 프로젝트 생성 요청 데이터 타입
 */
export interface CreateProjectRequest {
  projectName: string;
  serviceType: 'FE' | 'BE' | 'FULLSTACK';
  githubRepoUrl: string;
  frameworkType: string;
  defaultBranch: string;
}

/**
 * 프로젝트 목록 조회 훅
 * GET /api/v1/projects
 */
export function useProjects(enabled = true) {
  return useQuery<ApiResponse<Project[]>>('/api/v1/projects', {
    enabled,
    refetchOnMount: true,
  });
}

/**
 * 프로젝트 생성 훅
 * POST /api/v1/projects
 */
export function useCreateProject(options?: {
  onSuccess?: (data: ApiResponse<Project>) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<ApiResponse<Project>, CreateProjectRequest>(
    '/api/v1/projects',
    'post',
    options
  );
}
