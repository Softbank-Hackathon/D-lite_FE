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

  // 로그아웃
  http.post('/api/auth/logout', () => {
    isAuthenticated = false;
    return HttpResponse.json({ success: true });
  }),
];
