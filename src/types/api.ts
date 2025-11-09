/**
 * @file api.ts
 * @description D-Light Backend API 타입 정의
 * API 명세서 기반으로 작성됨
 */

// ============================================
// 공통 응답 형식
// ============================================

/**
 * 공통 API 응답 래퍼 (일부 엔드포인트에서 사용)
 */
export interface ApiResponse<T> {
  message: string;
  result: T;
  errorCode: string | null;
  success: boolean;
}

// ============================================
// 인증 관련 타입
// ============================================

/**
 * 인증 상태 확인 응답 (인증된 경우)
 */
export interface AuthStatusSuccess {
  status: 'success';
  message: string;
  user: {
    githubId: number;
    login: string;
    avatarUrl: string;
    profileUrl: string;
  };
  apis: {
    currentUser: string;
    logout: string;
  };
}

/**
 * 인증 상태 확인 응답 (인증되지 않은 경우)
 */
export interface AuthStatusUnauthorized {
  status: 'unauthorized';
  message: string;
  loginUrl: string;
}

/**
 * 인증 상태 응답 (Union 타입)
 */
export type AuthStatusResponse = AuthStatusSuccess | AuthStatusUnauthorized;

// ============================================
// 사용자 관련 타입
// ============================================

/**
 * 사용자 정보
 * GET /api/users/me 응답 형식
 */
export interface User {
  id: number;
  githubId: number;
  login: string; // GitHub username
  email: string | null;
  profileUrl: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// GitHub 관련 타입
// ============================================

/**
 * GitHub 레포지토리 소유자 정보
 */
export interface GithubOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

/**
 * GitHub 레포지토리 정보
 * 주의: 백엔드 응답은 snake_case 사용
 */
export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  default_branch: string;
  owner: GithubOwner;
  pushed_at: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * GitHub 브랜치 커밋 정보
 */
export interface GithubCommit {
  sha: string;
  url: string;
}

/**
 * GitHub 브랜치 정보
 */
export interface GithubBranch {
  name: string;
  commit: GithubCommit;
  isProtected: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 프로젝트 관련 타입
// ============================================

/**
 * 서비스 타입
 */
export type ServiceType = 'FE' | 'BE' | 'FULLSTACK';

/**
 * 프로젝트 정보
 */
export interface Project {
  id: number;
  projectName: string;
  serviceType: ServiceType;
  githubRepoUrl: string;
  frameworkType: string;
  defaultBranch: string;
  isActive: boolean;
}

/**
 * 프로젝트 생성 요청
 */
export interface CreateProjectRequest {
  projectName: string;
  serviceType: ServiceType;
  githubRepoUrl: string;
  frameworkType: string;
  defaultBranch: string;
}

/**
 * 프로젝트 목록 조회 응답
 */
export type ProjectListResponse = ApiResponse<Project[]>;

/**
 * 프로젝트 생성 응답
 */
export type CreateProjectResponse = ApiResponse<Project>;

// ============================================
// 프로젝트 타겟 관련 타입
// ============================================

/**
 * 환경 타입
 */
export type EnvironmentType = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';

/**
 * 프로젝트 타겟 정보
 */
export interface ProjectTarget {
  id: number;
  projectId: number;
  env: EnvironmentType;
  roleArn: string;
  region: string;
  isDefault: boolean;
}

/**
 * 프로젝트 타겟 생성 요청
 */
export interface CreateProjectTargetRequest {
  projectId: number;
  env: EnvironmentType;
  roleArn: string;
  externalId: string;
  region: string;
  sessionDurationSecs?: number;
  default: boolean;
}

/**
 * 프로젝트 타겟 생성 응답
 */
export type CreateProjectTargetResponse = ApiResponse<ProjectTarget>;

/**
 * 프로젝트 타겟 목록 조회 응답
 */
export type ProjectTargetListResponse = ApiResponse<ProjectTarget[]>;

// ============================================
// 배포 관련 타입
// ============================================

/**
 * 프로젝트 타입 (배포용)
 */
export type DeploymentProjectType = 'frontend' | 'backend';

/**
 * 프레임워크 타입
 */
export type FrontendFramework = 'Vanilla JS' | 'React' | 'Vue.js' | 'Angular' | 'Svelte';
export type BackendFramework = 'Spring Boot' | 'Django' | 'Node.js';
export type FrameworkType = FrontendFramework | BackendFramework;

/**
 * 배포 요청 (전체 프로젝트)
 */
export interface DeploymentProjectRequest {
  githubRepositoryUrl: string;
  projectType: DeploymentProjectType;
  frameworkType: FrameworkType;
  environmentVariables?: string; // JSON 문자열
  region: string;
  projectName: string;
  roleArn: string;
  externalId: string;
}

/**
 * 프론트엔드 배포 요청
 */
export interface DeployFrontendRequest {
  projectId: number;
  env?: Record<string, string>; // 환경 변수 객체
}

/**
 * 배포 시작 응답
 */
export type DeploymentStartResponse = ApiResponse<string>;

/**
 * 배포 상태
 */
export type DeploymentStatus = 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';

/**
 * 배포 상태 조회 응답 (진행 중)
 */
export interface DeploymentStatusInProgress {
  status: 'IN_PROGRESS';
}

/**
 * 배포 상태 조회 응답 (성공)
 */
export interface DeploymentStatusSuccess {
  status: 'SUCCESS';
  deploymentUrl: string;
}

/**
 * 배포 상태 조회 응답 (실패)
 */
export interface DeploymentStatusFailed {
  status: 'FAILED';
  errorMessage: string;
}

/**
 * 배포 상태 조회 응답 (Union 타입)
 */
export type DeploymentStatusResponse =
  | DeploymentStatusInProgress
  | DeploymentStatusSuccess
  | DeploymentStatusFailed;

// ============================================
// AWS Role Assume & Quick Create Link 관련 타입
// ============================================

export interface AssumeRoleRequest {
  roleArn: string;
  externalId?: string;
}

export interface AssumeRoleResponse {
  message: string;
}

export interface RegistrationTokenRequest {
  ttlSeconds?: number;
}

export interface RegistrationTokenResponse {
  registrationToken: string;
  externalId: string;
  expiresAt: string;
}

export interface QuickCreateLinkRequest {
  externalId: string;
  registrationToken: string;
  region: string;
  stackName: string;
}

export interface QuickCreateLinkResponse {
  quickCreateUrl: string;
}
