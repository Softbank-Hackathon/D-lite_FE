import axios, { isAxiosError } from 'axios';

// 환경 변수에서 API Base URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://54.180.117.76:8080';

// 새로운 Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  withCredentials: true, // JSESSIONID 쿠키 포함을 위해 필수
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청을 보내기 전에 수행할 작업
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    // 요청 에러 처리
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거합니다.
    console.log(`[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거합니다.
    if (error.response) {
      // 요청이 이루어졌으며 서버가 2xx 외의 상태 코드로 응답했습니다.
      console.error(
        `[API Response Error] ${error.response.status} ${error.response.config.method?.toUpperCase()} ${error.response.config.url}`,
        error.response.data
      );

      // 401 Unauthorized 에러 처리 - 로그인 페이지로 리다이렉트
      if (error.response.status === 401) {
        console.warn('[Auth] 401 Unauthorized - Redirecting to GitHub OAuth login');
        // GitHub OAuth 로그인 페이지로 리다이렉트
        window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
      }
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못했습니다.
      console.error('[API Response Error] No response received', error.request);
    } else {
      // 요청을 설정하는 중에 문제가 발생했습니다.
      console.error('[API Response Error] Error setting up request', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { isAxiosError };
