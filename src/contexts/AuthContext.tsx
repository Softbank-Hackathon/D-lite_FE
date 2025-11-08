import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import axios from '../api/axiosInstance';
import type { AuthStatusResponse, User } from '../types/api';

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 인증 상태 확인 API 호출
        const response = await axios.get<AuthStatusResponse>('/');
        
        if (response.data.status === 'success') {
          setIsAuthenticated(true);
          
          // 사용자 상세 정보 조회
          try {
            const userResponse = await axios.get<User>('/api/users/me');
            setUser(userResponse.data);
          } catch (userError) {
            console.error('Failed to fetch user info:', userError);
            // 사용자 정보는 실패해도 인증 상태는 유지
            // 기본 정보만 사용
            setUser({
              id: 0,
              githubId: response.data.user.githubId,
              username: response.data.user.login,
              email: '',
              avatarUrl: response.data.user.avatarUrl,
              profileUrl: response.data.user.profileUrl,
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = () => {
    // GitHub OAuth 로그인 페이지로 리다이렉트
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://54.180.117.76:8080';
    window.location.href = `${baseUrl}/oauth2/authorization/github`;
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
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
