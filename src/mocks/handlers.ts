import { http, HttpResponse } from 'msw';

// 가상 GitHub 사용자 데이터
const mockUser = {
  login: 'mock-user',
  name: 'Mock User',
};

// 가상 GitHub 레포지토리 목록
const mockRepos = [
  { id: 1, name: 'project-a', full_name: 'mock-user/project-a', private: false },
  { id: 2, name: 'project-b', full_name: 'mock-user/project-b', private: true },
  { id: 3, name: 'project-c', full_name: 'mock-user/project-c', private: false },
];

let isAuthenticated = false;

export const handlers = [
  // GitHub 로그인 요청 (실제로는 백엔드가 리디렉션)
  // 여기서는 시뮬레이션을 위해 아무것도 하지 않습니다.
  http.get('/api/auth/github', () => {
    return new Response(null, { status: 302, headers: { 'Location': '/api/auth/github/callback?code=mock_code' } });
  }),

  // GitHub 콜백 처리
  http.get('/api/auth/github/callback', () => {
    isAuthenticated = true;
    // 실제라면 토큰을 발급하지만, 여기서는 쿠키나 세션 상태를 흉내냅니다.
    return HttpResponse.json({ success: true, message: 'Logged in successfully', user: mockUser });
  }),

  // 인증 상태 확인
  http.get('/api/auth/status', () => {
    if (isAuthenticated) {
      return HttpResponse.json({ isAuthenticated: true, user: mockUser });
    }
    return HttpResponse.json({ isAuthenticated: false, user: null });
  }),

  // 사용자 레포지토리 목록 조회
  http.get('/api/user/repos', ({ request }) => {
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
