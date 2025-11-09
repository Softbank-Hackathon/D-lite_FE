import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import { useUserInfo } from '../hooks/api/useAuthApi';
import type { User } from '../types/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  // useUserInfo 훅 사용 (자동으로 사용자 정보 조회)
  const { data: userData, isLoading, error } = useUserInfo();

  useEffect(() => {
    if (userData) {
      setIsAuthenticated(true);
      setUser(userData);
    } else if (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [userData, error]);

  const login = () => {
    // GitHub OAuth 로그인 페이지로 리다이렉트
    // 개발 환경: 프록시 사용 (상대 경로)
    // 프로덕션 환경: 백엔드 직접 호출 (절대 경로)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const oauthUrl = backendUrl 
      ? `${backendUrl}/oauth2/authorization/github`
      : '/oauth2/authorization/github';
    
    window.location.href = oauthUrl;
  };

  const logout = async () => {
    // 로그아웃 시 /logout 엔드포인트 호출 (Spring Security 표준)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const logoutUrl = backendUrl 
      ? `${backendUrl}/logout`
      : '/logout';
    
    window.location.href = logoutUrl;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
