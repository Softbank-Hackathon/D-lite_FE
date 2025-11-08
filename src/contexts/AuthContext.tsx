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
    // 프록시 사용 시 상대 경로
    window.location.href = '/oauth2/authorization/github';
  };

  const logout = async () => {
    // 로그아웃 시 /logout 엔드포인트 호출 (Spring Security 표준)
    window.location.href = '/logout';
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
