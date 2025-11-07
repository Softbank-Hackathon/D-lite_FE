import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from '../api/axiosInstance';

interface User {
  login: string;
  name: string;
  avatar_url?: string; // GitHub 아바타 URL 추가
  // 필요한 다른 사용자 정보 추가
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  handleLoginSuccess: (user: User) => void; // handleLoginSuccess 추가
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/v1/auth/status');
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async () => {
    try {
      // Make an API call to the backend to initiate GitHub OAuth
      // The backend will then redirect the browser to GitHub's authorization page
      await axios.get('/api/v1/auth/github/login');
      // The browser will automatically follow the redirect from the backend
    } catch (error) {
      console.error('Failed to initiate GitHub login:', error);
      // Handle error, e.g., show a message to the user
    }
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

  const handleLoginSuccess = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, handleLoginSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
