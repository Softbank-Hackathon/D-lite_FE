import { http, HttpResponse } from 'msw';

import type {
  AuthStatusResponse,
  User,
  GithubRepository,
  GithubBranch,
  ProjectListResponse,
  CreateProjectResponse,
  DeploymentStartResponse,
  DeploymentStatusResponse,
} from '../types/api';

// 가상 사용자 데이터
const mockUser: User = {
  id: 1,
  githubId: 123456,
  login: 'mock-user',
  email: 'mock-user@example.com',
  profileUrl: 'https://github.com/mock-user',
  createdAt: '2024-01-01T00:00:00',
  updatedAt: '2024-01-15T10:30:00',
};

// 가상 GitHub 레포지토리 목록 (실제 API 응답 형식에 맞춤 - snake_case)
const mockRepos: GithubRepository[] = [
  {
    id: 1,
    name: 'project-a',
    full_name: 'mock-user/project-a',
    description: 'Test project A',
    private: false,
    html_url: 'https://github.com/mock-user/project-a',
    clone_url: 'https://github.com/mock-user/project-a.git',
    ssh_url: 'git@github.com:mock-user/project-a.git',
    default_branch: 'main',
    owner: {
      login: 'mock-user',
      avatar_url: 'https://avatars.githubusercontent.com/u/123456',
      html_url: 'https://github.com/mock-user',
    },
    pushed_at: '2024-01-15T10:30:00Z',
    language: 'JavaScript',
    stargazers_count: 10,
    watchers_count: 5,
    forks_count: 2,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-15T10:30:00',
  },
  {
    id: 2,
    name: 'project-b',
    full_name: 'mock-user/project-b',
    description: 'Test project B',
    private: true,
    html_url: 'https://github.com/mock-user/project-b',
    clone_url: 'https://github.com/mock-user/project-b.git',
    ssh_url: 'git@github.com:mock-user/project-b.git',
    default_branch: 'develop',
    owner: {
      login: 'mock-user',
      avatar_url: 'https://avatars.githubusercontent.com/u/123456',
      html_url: 'https://github.com/mock-user',
    },
    pushed_at: '2024-01-10T08:20:00Z',
    language: 'TypeScript',
    stargazers_count: 25,
    watchers_count: 8,
    forks_count: 5,
    createdAt: '2023-12-01T00:00:00',
    updatedAt: '2024-01-10T08:20:00',
  },
  {
    id: 3,
    name: 'project-c',
    full_name: 'mock-user/project-c',
    description: null,
    private: false,
    html_url: 'https://github.com/mock-user/project-c',
    clone_url: 'https://github.com/mock-user/project-c.git',
    ssh_url: 'git@github.com:mock-user/project-c.git',
    default_branch: 'main',
    owner: {
      login: 'mock-user',
      avatar_url: 'https://avatars.githubusercontent.com/u/123456',
      html_url: 'https://github.com/mock-user',
    },
    pushed_at: '2024-01-20T14:45:00Z',
    language: 'Python',
    stargazers_count: 3,
    watchers_count: 2,
    forks_count: 0,
    createdAt: '2024-01-05T00:00:00',
    updatedAt: '2024-01-20T14:45:00',
  },
];

// 개발 편의를 위해 기본 인증 상태를 true로 설정
// 실제 API 연결 테스트 시에는 false로 변경하여 OAuth 플로우 테스트
let isAuthenticated = true;

// 배포 상태를 저장할 맵 (deploymentId → 상태)
const deploymentStates = new Map<string, { status: string; pollCount: number }>();

export const handlers = [
  // ============================================
  // 인증 관련 API
  // ============================================

  // 홈 / 인증 상태 확인
  http.get('/', () => {
    if (isAuthenticated) {
      const response: AuthStatusResponse = {
        status: 'success',
        message: '로그인 성공!',
        user: {
          githubId: mockUser.githubId,
          login: mockUser.login,
          avatarUrl: `https://github.com/${mockUser.login}.png`,
          profileUrl: mockUser.profileUrl,
        },
        apis: {
          currentUser: '/api/users/me',
          logout: '/logout',
        },
      };
      return HttpResponse.json(response);
    }

    const response: AuthStatusResponse = {
      status: 'unauthorized',
      message: '로그인이 필요합니다.',
      loginUrl: '/oauth2/authorization/github',
    };
    return HttpResponse.json(response);
  }),

  // 현재 사용자 정보 조회
  http.get('/api/users/me', () => {
    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }
    return HttpResponse.json(mockUser);
  }),

  // 로그아웃
  http.post('/api/auth/logout', () => {
    isAuthenticated = false;
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // GitHub 연동 API
  // ============================================

  // 사용자 레포지토리 목록 조회
  http.get('/api/v1/github/repos', () => {
    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }
    // 배열로 직접 반환 (공통 응답 형식 아님)
    return HttpResponse.json(mockRepos);
  }),

  // 브랜치 목록 조회 (owner/repo 형식)
  http.get('/api/v1/github/repos/:owner/:repo/branches', ({ params }) => {
    const { owner, repo } = params;

    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    // 레포별 더미 브랜치 데이터
    const branchesMap: Record<string, GithubBranch[]> = {
      'mock-user/project-a': [
        {
          name: 'main',
          commit: {
            sha: 'abc123def456',
            url: 'https://api.github.com/repos/mock-user/project-a/commits/abc123def456',
          },
          isProtected: true,
          createdAt: '2024-01-01T00:00:00',
          updatedAt: '2024-01-15T10:30:00',
        },
        {
          name: 'develop',
          commit: {
            sha: 'def456ghi789',
            url: 'https://api.github.com/repos/mock-user/project-a/commits/def456ghi789',
          },
          isProtected: false,
          createdAt: '2024-01-05T00:00:00',
          updatedAt: '2024-01-14T15:20:00',
        },
        {
          name: 'feature/new-ui',
          commit: {
            sha: 'ghi789jkl012',
            url: 'https://api.github.com/repos/mock-user/project-a/commits/ghi789jkl012',
          },
          isProtected: false,
          createdAt: '2024-01-10T00:00:00',
          updatedAt: '2024-01-12T08:45:00',
        },
      ],
      'mock-user/project-b': [
        {
          name: 'develop',
          commit: {
            sha: 'xyz789abc123',
            url: 'https://api.github.com/repos/mock-user/project-b/commits/xyz789abc123',
          },
          isProtected: true,
          createdAt: '2023-12-01T00:00:00',
          updatedAt: '2024-01-10T08:20:00',
        },
        {
          name: 'staging',
          commit: {
            sha: 'mno345pqr678',
            url: 'https://api.github.com/repos/mock-user/project-b/commits/mno345pqr678',
          },
          isProtected: false,
          createdAt: '2023-12-15T00:00:00',
          updatedAt: '2024-01-08T12:30:00',
        },
      ],
      'mock-user/project-c': [
        {
          name: 'main',
          commit: {
            sha: 'aaa111bbb222',
            url: 'https://api.github.com/repos/mock-user/project-c/commits/aaa111bbb222',
          },
          isProtected: true,
          createdAt: '2024-01-05T00:00:00',
          updatedAt: '2024-01-20T14:45:00',
        },
        {
          name: 'feature/api-integration',
          commit: {
            sha: 'ccc333ddd444',
            url: 'https://api.github.com/repos/mock-user/project-c/commits/ccc333ddd444',
          },
          isProtected: false,
          createdAt: '2024-01-15T00:00:00',
          updatedAt: '2024-01-18T10:20:00',
        },
      ],
    };

    const repoKey = `${owner}/${repo}`;
    
    // 특정 레포지토리에 대한 브랜치가 있으면 반환
    if (branchesMap[repoKey]) {
      return HttpResponse.json(branchesMap[repoKey]);
    }

    // 없으면 기본 브랜치 반환 (main 브랜치)
    const defaultBranches: GithubBranch[] = [
      {
        name: 'main',
        commit: {
          sha: `default-${Date.now().toString(36)}`,
          url: `https://api.github.com/repos/${owner}/${repo}/commits/default123`,
        },
        isProtected: false,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'develop',
        commit: {
          sha: `dev-${Date.now().toString(36)}`,
          url: `https://api.github.com/repos/${owner}/${repo}/commits/dev123`,
        },
        isProtected: false,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: new Date().toISOString(),
      },
    ];

    // 배열로 직접 반환 (공통 응답 형식 아님)
    return HttpResponse.json(defaultBranches);
  }),

  // ============================================
  // 프로젝트 API
  // ============================================

  // 프로젝트 목록 조회
  http.get('/api/v1/projects', () => {
    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    const response: ProjectListResponse = {
      message: '프로젝트 목록 조회 성공',
      result: [
        {
          id: 1,
          projectName: 'Nelsa web',
          serviceType: 'FE',
          githubRepoUrl: 'https://github.com/mock-user/project-a',
          frameworkType: 'React',
          defaultBranch: 'main',
          isActive: true,
        },
        {
          id: 2,
          projectName: 'Website builder',
          serviceType: 'FE',
          githubRepoUrl: 'https://github.com/mock-user/project-b',
          frameworkType: 'Vue.js',
          defaultBranch: 'develop',
          isActive: true,
        },
        {
          id: 3,
          projectName: 'E-commerce Platform',
          serviceType: 'FULLSTACK',
          githubRepoUrl: 'https://github.com/mock-user/project-c',
          frameworkType: 'Angular',
          defaultBranch: 'main',
          isActive: true,
        },
      ],
      errorCode: null,
      success: true,
    };

    return HttpResponse.json(response);
  }),

  // 프로젝트 생성
  http.post('/api/v1/projects', async ({ request }) => {
    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    const body = (await request.json()) as {
      projectName: string;
      serviceType: 'FE' | 'BE' | 'FULLSTACK';
      githubRepoUrl: string;
      frameworkType: string;
      defaultBranch: string;
    };

    const newProject = {
      id: Math.floor(Math.random() * 10000),
      projectName: body.projectName,
      serviceType: body.serviceType,
      githubRepoUrl: body.githubRepoUrl,
      frameworkType: body.frameworkType,
      defaultBranch: body.defaultBranch,
      isActive: true,
    };

    const response: CreateProjectResponse = {
      message: '프로젝트가 생성되었습니다.',
      result: newProject,
      errorCode: null,
      success: true,
    };

    return HttpResponse.json(response);
  }),

  // ============================================
  // 배포 API
  // ============================================

  // 자동화 배포 시작
  http.post('/api/v1/deployments/deployment-project', async ({ request }) => {
    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    const body = await request.json();
    console.log('Deployment request:', body);

    // 랜덤 deploymentId 생성
    const deploymentId = `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 초기 배포 상태 저장
    deploymentStates.set(deploymentId, { status: 'IN_PROGRESS', pollCount: 0 });

    const response: DeploymentStartResponse = {
      message: '프로젝트 배포가 시작되었습니다.',
      result: deploymentId,
      errorCode: null,
      success: true,
    };

    return HttpResponse.json(response);
  }),

  // 배포 상태 확인
  http.get('/api/v1/deployments/:deploymentId/status', ({ params }) => {
    const { deploymentId } = params;

    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    let state = deploymentStates.get(deploymentId as string);

    if (!state) {
      // 존재하지 않는 deploymentId면 초기화
      state = { status: 'IN_PROGRESS', pollCount: 0 };
      deploymentStates.set(deploymentId as string, state);
    }

    // 폴링 횟수 증가
    state.pollCount++;

    // 시뮬레이션: 처음 3번은 IN_PROGRESS, 4번째부터 SUCCESS 또는 FAILED
    if (state.pollCount <= 3) {
      state.status = 'IN_PROGRESS';
      const response: DeploymentStatusResponse = {
        status: 'IN_PROGRESS',
      };
      return HttpResponse.json(response);
    } else {
      // 80% 확률로 SUCCESS, 20% 확률로 FAILED
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        state.status = 'SUCCESS';
        const response: DeploymentStatusResponse = {
          status: 'SUCCESS',
          deploymentUrl: `https://d-light-${deploymentId}.s3.ap-northeast-2.amazonaws.com/index.html`,
        };
        return HttpResponse.json(response);
      } else {
        state.status = 'FAILED';
        const response: DeploymentStatusResponse = {
          status: 'FAILED',
          errorMessage: 'Build failed: npm run build exited with code 1',
        };
        return HttpResponse.json(response);
      }
    }
  }),

  // ============================================
  // 테스트용: 로그인 상태 강제 설정
  // ============================================
  
  // 테스트용 로그인 (MSW 전용)
  http.post('/api/test/login', () => {
    isAuthenticated = true;
    return HttpResponse.json({ success: true, message: 'Test login successful' });
  }),

  // 테스트용 로그아웃 (MSW 전용)
  http.post('/api/test/logout', () => {
    isAuthenticated = false;
    return HttpResponse.json({ success: true, message: 'Test logout successful' });
  }),
];
