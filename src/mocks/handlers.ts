import { http, HttpResponse } from 'msw';

// 가상 GitHub 사용자 데이터
const mockUser = {
  login: 'mock-user',
  name: 'Mock User',
};

// 가상 GitHub 레포지토리 목록
const mockRepos = [
  { id: 1, name: 'project-a', full_name: 'mock-user/project-a', private: false, html_url: 'https://github.com/mock-user/project-a' },
  { id: 2, name: 'project-b', full_name: 'mock-user/project-b', private: true, html_url: 'https://github.com/mock-user/project-b' },
  { id: 3, name: 'project-c', full_name: 'mock-user/project-c', private: false, html_url: 'https://github.com/mock-user/project-c' },
];

let isAuthenticated = false;

// 배포 상태를 저장할 맵 (deploymentId → 상태)
const deploymentStates = new Map<string, { status: string; pollCount: number }>();

export const handlers = [
  // GitHub 로그인 시작 요청 (백엔드에서 GitHub로 리디렉션 시뮬레이션)
  http.get('/api/v1/auth/github/login', () => {
    // 실제 GitHub 인증 URL을 시뮬레이션합니다.
    // 이 URL은 백엔드에서 생성되어 리디렉션될 것입니다.
    const mockGithubAuthUrl = `https://github.com/login/oauth/authorize?client_id=MOCK_CLIENT_ID&redirect_uri=http://localhost:8080/login/oauth2/code/github&scope=repo,user`;
    return new HttpResponse(null, {
      status: 302,
      headers: {
        'Location': mockGithubAuthUrl,
      },
    });
  }),


  // GitHub 콜백 처리
  http.get('/api/v1/github/auth/callback', () => {
    isAuthenticated = true;
    // 실제라면 토큰을 발급하지만, 여기서는 쿠키나 세션 상태를 흉내냅니다.
    return HttpResponse.json({ success: true, message: 'Logged in successfully', user: mockUser });
  }),

  // 인증 상태 확인
  http.get('/api/v1/auth/status', () => {
    if (isAuthenticated) {
      return HttpResponse.json({ isAuthenticated: true, user: mockUser });
    }
    return HttpResponse.json({ isAuthenticated: false, user: null });
  }),

  // 사용자 레포지토리 목록 조회
  http.get('/api/v1/github/repos', () => {
    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }
    return HttpResponse.json(mockRepos);
  }),

  // 프로젝트 목록 조회
  http.get('/api/v1/projects', () => {
    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }
    
    const mockProjects = [
      {
        id: 1,
        name: "Nelsa web",
        repositoryUrl: "https://github.com/mock-user/my-repository-a",
        repositoryName: "my-repository-a",
        framework: "React",
        region: "ap-northeast-2 (Seoul)",
        deploymentUrl: "https://d-light-nelsa.s3.ap-northeast-2.amazonaws.com/index.html",
        status: "Completed",
        lastDeploymentDate: "2023-05-25",
      },
      {
        id: 2,
        name: "Website builder",
        repositoryUrl: "https://github.com/mock-user/my-repository-b",
        repositoryName: "my-repository-b",
        framework: "Vue",
        region: "us-east-1 (N. Virginia)",
        deploymentUrl: "https://d-light-builder.s3.us-east-1.amazonaws.com/index.html",
        status: "Failed",
        lastDeploymentDate: "2023-07-13",
      },
      {
        id: 3,
        name: "E-commerce Platform",
        repositoryUrl: "https://github.com/mock-user/my-repository-c",
        repositoryName: "my-repository-c",
        framework: "Angular",
        region: "eu-central-1 (Frankfurt)",
        deploymentUrl: "https://d-light-ecommerce.s3.eu-central-1.amazonaws.com/index.html",
        status: "Running",
        lastDeploymentDate: "2023-11-01",
      },
    ];

    return HttpResponse.json(mockProjects);
  }),

  // 로그아웃
  http.post('/api/auth/logout', () => {
    isAuthenticated = false;
    return HttpResponse.json({ success: true });
  }),

  // 브랜치 목록 조회
  http.get('/api/v1/github/repos/:repoId/branches', ({ params }) => {
    const { repoId } = params;
    
    // 레포별 더미 브랜치 데이터
    const branchesMap: Record<string, Array<{ name: string; sha: string }>> = {
      '1': [
        { name: 'main', sha: 'abc123def456' },
        { name: 'develop', sha: 'def456ghi789' },
        { name: 'feature/new-ui', sha: 'ghi789jkl012' },
      ],
      '2': [
        { name: 'main', sha: 'xyz789abc123' },
        { name: 'staging', sha: 'mno345pqr678' },
      ],
      '3': [
        { name: 'master', sha: 'aaa111bbb222' },
        { name: 'develop', sha: 'ccc333ddd444' },
        { name: 'feature/api-integration', sha: 'eee555fff666' },
        { name: 'hotfix/bug-fix', sha: 'ggg777hhh888' },
      ],
    };

    const branches = branchesMap[repoId as string] || [
      { name: 'main', sha: 'default123' },
    ];

    return HttpResponse.json(branches);
  }),

  // 배포 시작
  http.post('/api/v1/deployments', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    console.log('Deployment request:', body);

    // 랜덤 deploymentId 생성
    const deploymentId = `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 초기 배포 상태 저장
    deploymentStates.set(deploymentId, { status: 'IN_PROGRESS', pollCount: 0 });

    return HttpResponse.json({
      deploymentId,
      status: 'IN_PROGRESS',
    });
  }),

  // 배포 상태 확인
  http.get('/api/v1/deployments/:deploymentId/status', ({ params }) => {
    const { deploymentId } = params;
    
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
      return HttpResponse.json({
        status: 'IN_PROGRESS',
      });
    } else {
      // 80% 확률로 SUCCESS, 20% 확률로 FAILED
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        state.status = 'SUCCESS';
        return HttpResponse.json({
          status: 'SUCCESS',
          deploymentUrl: `https://d-light-${deploymentId}.s3.ap-northeast-2.amazonaws.com/index.html`,
        });
      } else {
        state.status = 'FAILED';
        return HttpResponse.json({
          status: 'FAILED',
          errorMessage: 'Build failed: npm run build exited with code 1',
        });
      }
    }
  }),
];
